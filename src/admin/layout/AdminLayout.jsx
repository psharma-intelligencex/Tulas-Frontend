// The admin shell: sidebar navigation (grouped, role-aware), a topbar with the
// tenant switcher (for admins who can act on more than one chapter) and the
// signed-in user + logout.
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { RESOURCES, RESOURCE_BY_KEY, NAV_GROUPS } from "../config/resources.js";
import { iconForLink } from "../config/navIcons.js";

// Contextual page title from the current path.
function pageTitle(pathname) {
  if (pathname === "/admin") return "Dashboard";
  if (pathname.startsWith("/admin/submissions")) return "Submissions";
  if (pathname.startsWith("/admin/platform/chapters")) return "Chapters";
  if (pathname.startsWith("/admin/platform/users")) return "Users";
  if (pathname.startsWith("/admin/platform/audit")) return "Audit Log";
  const m = pathname.match(/^\/admin\/r\/([^/]+)(\/([^/]+))?/);
  if (m) {
    const label = RESOURCE_BY_KEY[m[1]]?.label || m[1];
    if (m[3] === "new") return `New ${label}`;
    if (m[3]) return `Edit ${label}`;
    return label;
  }
  return "Dashboard";
}

const STATIC_LINKS = [
  { to: "/admin", label: "Dashboard", group: "__top", end: true },
  { to: "/admin/submissions", label: "Submissions", group: "Submissions" },
  { to: "/admin/platform/chapters", label: "Chapters", group: "Platform", platform: true },
  { to: "/admin/platform/users", label: "Users", group: "Platform", platform: true },
  { to: "/admin/platform/audit", label: "Audit Log", group: "Platform", platform: true },
];

export default function AdminLayout() {
  const { me, logout, isPlatform, chaptersList, actingChapter, actAs } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const resourceLinks = RESOURCES.map((r) => ({
    to: `/admin/r/${r.key}`,
    label: r.label,
    group: r.group,
    key: r.key,
  }));

  const linksByGroup = (group) => [
    ...STATIC_LINKS.filter((l) => l.group === group && (!l.platform || isPlatform)),
    ...resourceLinks.filter((l) => l.group === group),
  ];

  return (
    <div className="csa-admin">
      <div className="csa-admin-shell">
        <aside className={`csa-admin-sidebar ${open ? "open" : ""}`}>
          <div className="csa-admin-brand">
            <img className="csa-admin-brand-logo" src="/logo/navbar-csa.png" alt="CSA Uttarakhand" />
          </div>
          <nav className="csa-admin-nav" onClick={() => setOpen(false)}>
            {STATIC_LINKS.filter((l) => l.group === "__top").map((l) => {
              const Icon = iconForLink(l);
              return (
                <NavLink key={l.to} to={l.to} end={l.end}>
                  <Icon /> {l.label}
                </NavLink>
              );
            })}
            {NAV_GROUPS.map((group) => {
              const links = linksByGroup(group);
              if (!links.length) return null;
              return (
                <div key={group}>
                  <div className="csa-admin-nav-group">{group}</div>
                  {links.map((l) => {
                    const Icon = iconForLink(l);
                    return (
                      <NavLink key={l.to} to={l.to} end={l.end}>
                        <Icon /> {l.label}
                      </NavLink>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </aside>

        <div className="csa-admin-main">
          <header className="csa-admin-topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="csa-btn csa-btn-sm" style={{ display: "none" }} onClick={() => setOpen((o) => !o)}>☰</button>
              <h1>{pageTitle(location.pathname)}</h1>
            </div>
            <div className="csa-admin-topbar-right">
              {chaptersList.length > 1 && (
                <select
                  className="csa-admin-select"
                  style={{ width: 200 }}
                  value={actingChapter}
                  onChange={(e) => actAs(e.target.value)}
                  title="Acting on chapter"
                >
                  {chaptersList.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name || c.slug}</option>
                  ))}
                </select>
              )}
              <span className="csa-admin-userchip">
                {me?.user?.full_name || me?.user?.email}
                {isPlatform && <span className="csa-badge">platform</span>}
              </span>
              <button className="csa-btn csa-btn-sm" onClick={logout}>Sign out</button>
            </div>
          </header>
          <main className="csa-admin-content" key={location.pathname}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
