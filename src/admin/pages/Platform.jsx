// Platform-admin views (super_admin / csau_admin): manage chapters and admin
// users across the whole platform, and read the audit log. Rendered for the
// three /admin/platform/* routes via the `view` prop.
import { useEffect, useState } from "react";
import { api } from "../api/client.js";

const CHAPTER_FIELDS = [
  { key: "university_name", label: "University", required: true },
  { key: "chapter_name", label: "Chapter name", required: true },
  { key: "slug", label: "Slug", required: true },
  { key: "short_name", label: "Short name" },
  { key: "domain", label: "Domain" },
  { key: "contact_email", label: "Contact email" },
  { key: "city", label: "City" },
];

function useList(path, dep) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = () => {
    setLoading(true);
    api
      .get(path, { params: { limit: 100 } })
      .then((r) => setRows(r.data?.data || []))
      .catch((e) => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false));
  };
  useEffect(reload, [path, dep]);
  return { rows, loading, error, reload };
}

function ChaptersView() {
  const { rows, loading, error, reload } = useList("/admin/chapters");
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/admin/chapters", form);
      setForm({});
      reload();
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };
  return (
    <div>
      {error && <div className="csa-error-banner">{error}</div>}
      <div className="csa-card csa-card-pad" style={{ marginBottom: 18 }}>
        <h3 style={{ marginTop: 0 }}>New chapter (onboard a university)</h3>
        {msg && <div className="csa-error-banner">{msg}</div>}
        <form onSubmit={submit} className="csa-form-grid">
          {CHAPTER_FIELDS.map((f) => (
            <div key={f.key} className="csa-field">
              <label className="csa-label">{f.label}{f.required && " *"}</label>
              <input className="csa-admin-input" required={f.required}
                value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
            </div>
          ))}
          <div className="csa-field col-span-2 csa-form-actions" style={{ marginTop: 0 }}>
            <button className="csa-btn csa-btn-primary">Create chapter</button>
          </div>
        </form>
      </div>
      <div className="csa-card csa-table-wrap">
        <table className="csa-table">
          <thead><tr><th>Chapter</th><th>Slug</th><th>Domain</th><th>Active</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4}><span className="csa-spin" /></td></tr> :
              rows.map((c) => (
                <tr key={c.id}>
                  <td>{c.chapter_name}</td><td>{c.slug}</td><td>{c.domain || "-"}</td>
                  <td><span className={`csa-badge ${c.is_active ? "csa-badge-success" : "csa-badge-danger"}`}>{c.is_active ? "Yes" : "No"}</span></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersView() {
  const { rows, loading, error, reload } = useList("/admin/users");
  const [form, setForm] = useState({ role: "chapter_admin" });
  const [msg, setMsg] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/admin/users", form);
      setForm({ role: "chapter_admin" });
      reload();
    } catch (err) {
      setMsg(err.response?.data?.message || err.message);
    }
  };
  return (
    <div>
      {error && <div className="csa-error-banner">{error}</div>}
      <div className="csa-card csa-card-pad" style={{ marginBottom: 18 }}>
        <h3 style={{ marginTop: 0 }}>New admin user</h3>
        {msg && <div className="csa-error-banner">{msg}</div>}
        <form onSubmit={submit} className="csa-form-grid">
          <div className="csa-field"><label className="csa-label">Full name *</label>
            <input className="csa-admin-input" required value={form.full_name || ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
          <div className="csa-field"><label className="csa-label">Email *</label>
            <input className="csa-admin-input" type="email" required value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="csa-field"><label className="csa-label">Password *</label>
            <input className="csa-admin-input" type="password" required value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
          <div className="csa-field"><label className="csa-label">Role</label>
            <select className="csa-admin-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {["chapter_admin", "content_editor", "event_manager", "team_manager", "read_only_admin", "csau_admin", "super_admin"].map((r) => <option key={r}>{r}</option>)}
            </select></div>
          <div className="csa-field col-span-2 csa-form-actions" style={{ marginTop: 0 }}>
            <button className="csa-btn csa-btn-primary">Create user</button>
          </div>
        </form>
      </div>
      <div className="csa-card csa-table-wrap">
        <table className="csa-table">
          <thead><tr><th>Name</th><th>Email</th><th>Active</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={3}><span className="csa-spin" /></td></tr> :
              rows.map((u) => (
                <tr key={u.id}><td>{u.full_name}</td><td>{u.email}</td>
                  <td><span className={`csa-badge ${u.is_active ? "csa-badge-success" : "csa-badge-danger"}`}>{u.is_active ? "Yes" : "No"}</span></td></tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditView() {
  const { rows, loading, error } = useList("/admin/audit");
  return (
    <div>
      {error && <div className="csa-error-banner">{error}</div>}
      <div className="csa-card csa-table-wrap">
        <table className="csa-table">
          <thead><tr><th>When</th><th>Action</th><th>Entity</th><th>User</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4}><span className="csa-spin" /></td></tr> :
              rows.map((a) => (
                <tr key={a.id}>
                  <td className="csa-muted">{a.created_at ? new Date(a.created_at).toLocaleString() : "-"}</td>
                  <td>{a.action}</td><td>{a.entity || "-"} {a.entity_id ? `#${String(a.entity_id).slice(0, 8)}` : ""}</td>
                  <td className="csa-muted">{a.user_id ? String(a.user_id).slice(0, 8) : "-"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Platform({ view }) {
  if (view === "users") return <UsersView />;
  if (view === "audit") return <AuditView />;
  return <ChaptersView />;
}
