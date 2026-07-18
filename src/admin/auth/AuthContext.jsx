// Auth state for the admin CMS: current user, roles, chapter scope, and the
// "acting as" chapter for platform admins. Restores the session on mount by
// calling /admin/me with the stored token.
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, tokens, api } from "../api/client.js";

const AuthContext = createContext(null);

const PLATFORM_ROLES = ["super_admin", "csau_admin"];

export function AuthProvider({ children }) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actingChapter, setActingChapter] = useState(tokens.chapter || "");
  const [chaptersList, setChaptersList] = useState([]);

  const refreshMe = useCallback(async () => {
    if (!tokens.access) {
      setMe(null);
      setLoading(false);
      return;
    }
    try {
      const data = await auth.me();
      setMe(data);
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  // Load the chapters this admin can act on: platform admins can target every
  // chapter (fetched from /admin/chapters); chapter admins are limited to the
  // chapters embedded in their /admin/me payload. Used by the tenant switcher
  // and to attach chapter_id on create.
  useEffect(() => {
    if (!me) {
      setChaptersList([]);
      return;
    }
    let cancelled = false;
    (async () => {
      if (me.isPlatform) {
        try {
          const res = await api.get("/admin/chapters", { params: { limit: 100 } });
          const rows = res.data?.data || [];
          if (!cancelled) setChaptersList(rows.map((c) => ({ id: c.id, slug: c.slug, name: c.chapter_name })));
        } catch {
          if (!cancelled) setChaptersList((me.chapters || []).map((c) => ({ id: c.id, slug: c.slug, name: c.chapter_name })));
        }
      } else {
        setChaptersList((me.chapters || []).map((c) => ({ id: c.id, slug: c.slug, name: c.chapter_name })));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [me]);

  // Default the acting chapter to the first one available (so chapter admins
  // never have to pick, and creates always carry a chapter_id).
  useEffect(() => {
    if (!actingChapter && chaptersList.length) {
      setActingChapter(chaptersList[0].slug);
      tokens.setChapter(chaptersList[0].slug);
    }
  }, [chaptersList, actingChapter]);

  const login = async (email, password) => {
    await auth.login(email, password);
    setLoading(true);
    await refreshMe();
  };

  const logout = async () => {
    await auth.logout();
    setMe(null);
    setActingChapter("");
  };

  const actAs = (slug) => {
    tokens.setChapter(slug);
    setActingChapter(slug);
  };

  const isPlatform = Boolean(me?.isPlatform);
  const roleSlugs = me?.roleSlugs || [];
  const hasRole = (...roles) => roleSlugs.some((r) => roles.includes(r));
  const can = (perm) => {
    const perms = me?.permissions || [];
    if (perms.includes("*")) return true;
    if (perms.includes(perm)) return true;
    const prefix = perm.split(":")[0] + ":*";
    return perms.includes(prefix);
  };

  return (
    <AuthContext.Provider
      value={{
        me,
        loading,
        login,
        logout,
        isPlatform,
        roleSlugs,
        hasRole,
        can,
        chapters: me?.chapters || [],
        chaptersList,
        actingChapter,
        actingChapterId:
          chaptersList.find((c) => c.slug === actingChapter)?.id || null,
        actAs,
        PLATFORM_ROLES,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
