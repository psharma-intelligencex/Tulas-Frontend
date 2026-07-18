// Admin API client for the CSA Uttarakhand /api/v1 backend.
//
// Talks to VITE_ADMIN_API_URL (the multi-tenant backend, upes-csa-api), which
// is distinct from VITE_SERVER_URL (the public site's data source). Handles:
//   - Bearer access token injection (from localStorage)
//   - X-Chapter-Slug header when a platform admin is "acting as" a chapter
//   - automatic one-shot refresh on 401 using the stored refresh token
//   - a normalized error shape { message, errors, status }
import axios from "axios";

const BASE =
  import.meta.env.VITE_ADMIN_API_URL ||
  import.meta.env.VITE_SERVER_URL ||
  "http://localhost:3000";

const STORAGE = {
  access: "csa_admin_access",
  refresh: "csa_admin_refresh",
  chapter: "csa_admin_chapter", // slug a platform admin is acting as
};

const tokens = {
  get access() {
    return localStorage.getItem(STORAGE.access) || "";
  },
  get refresh() {
    return localStorage.getItem(STORAGE.refresh) || "";
  },
  get chapter() {
    return localStorage.getItem(STORAGE.chapter) || "";
  },
  set({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(STORAGE.access, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE.refresh, refreshToken);
  },
  setChapter(slug) {
    if (slug) localStorage.setItem(STORAGE.chapter, slug);
    else localStorage.removeItem(STORAGE.chapter);
  },
  clear() {
    localStorage.removeItem(STORAGE.access);
    localStorage.removeItem(STORAGE.refresh);
    localStorage.removeItem(STORAGE.chapter);
  },
};

const api = axios.create({ baseURL: `${BASE}/api/v1` });

api.interceptors.request.use((config) => {
  if (tokens.access) config.headers.Authorization = `Bearer ${tokens.access}`;
  // Platform admins can scope reads/writes to a chapter via this header; the
  // backend ignores it for chapter-scoped users (they are already constrained).
  if (tokens.chapter) config.headers["X-Chapter-Slug"] = tokens.chapter;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    // One automatic refresh attempt on 401 (but never for the auth endpoints).
    if (
      response &&
      response.status === 401 &&
      !config._retried &&
      tokens.refresh &&
      !config.url.includes("/auth/")
    ) {
      config._retried = true;
      try {
        refreshing =
          refreshing ||
          axios.post(`${BASE}/api/v1/auth/refresh`, {
            refreshToken: tokens.refresh,
          });
        const { data } = await refreshing;
        refreshing = null;
        tokens.set(data.data);
        config.headers.Authorization = `Bearer ${tokens.access}`;
        return api(config);
      } catch (e) {
        refreshing = null;
        tokens.clear();
        if (typeof window !== "undefined") window.location.href = "/admin/login";
        return Promise.reject(normalize(e));
      }
    }
    return Promise.reject(normalize(error));
  }
);

const normalize = (error) => {
  const r = error.response;
  return {
    status: r?.status,
    message: r?.data?.message || error.message || "Request failed",
    errors: r?.data?.errors || null,
  };
};

// Thin helpers returning the unwrapped `data` payload.
const unwrap = (res) => res.data;

const auth = {
  async login(email, password) {
    const { data } = await axios.post(`${BASE}/api/v1/auth/login`, { email, password });
    tokens.set(data.data);
    return data.data; // { accessToken, refreshToken, user, roles }
  },
  async me() {
    return unwrap(await api.get("/admin/me")).data;
  },
  async logout() {
    try {
      if (tokens.refresh) await api.post("/auth/logout", { refreshToken: tokens.refresh });
    } catch {
      /* ignore */
    }
    tokens.clear();
  },
};

// Generic resource client. `base` is a path under /api/v1 (e.g. "/admin/legacy/blogs").
const resource = (base) => ({
  list: (params) => api.get(base, { params }).then((r) => r.data), // { data, meta }
  get: (id) => api.get(`${base}/${id}`).then((r) => r.data.data),
  create: (body) => api.post(base, body).then((r) => r.data.data),
  update: (id, body) => api.patch(`${base}/${id}`, body).then((r) => r.data.data),
  put: (id, body) => api.put(`${base}/${id}`, body).then((r) => r.data.data),
  remove: (id) => api.del ? api.del(`${base}/${id}`) : api.delete(`${base}/${id}`),
});

export { api, auth, resource, tokens, BASE };
