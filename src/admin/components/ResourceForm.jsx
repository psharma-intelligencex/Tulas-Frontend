// Generic create/edit form for any RESOURCES entry. Renders inputs from the
// field config, loads the row on edit, and submits create/update. On create it
// attaches chapter_id (from the acting chapter) so platform admins can write to
// the selected tenant; chapter admins are auto-scoped by the backend but the
// id is harmless to include.
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { resource as makeResource } from "../api/client.js";
import { RESOURCE_BY_KEY } from "../config/resources.js";
import { useAuth } from "../auth/AuthContext.jsx";

const emptyValue = (f) =>
  f.type === "boolean" ? false : f.type === "number" ? "" : "";

const toDatetimeLocal = (v) => {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function ResourceForm() {
  const { resourceKey, id } = useParams();
  const cfg = RESOURCE_BY_KEY[resourceKey];
  const navigate = useNavigate();
  const { actingChapterId, isPlatform } = useAuth();
  const isNew = id === "new";

  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const client = cfg ? makeResource(cfg.api) : null;

  useEffect(() => {
    if (!cfg) return;
    if (isNew) {
      const init = {};
      cfg.fields.forEach((f) => (init[f.key] = emptyValue(f)));
      setValues(init);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const row = await client.get(id);
        const init = {};
        cfg.fields.forEach((f) => {
          init[f.key] = f.type === "datetime" ? toDatetimeLocal(row[f.key]) : row[f.key] ?? emptyValue(f);
        });
        setValues(init);
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceKey, id]);

  if (!cfg) return <div className="csa-empty">Unknown resource.</div>;

  const setField = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const buildPayload = () => {
    const out = {};
    cfg.fields.forEach((f) => {
      let v = values[f.key];
      if (f.type === "number") v = v === "" || v == null ? undefined : Number(v);
      if (f.type === "datetime") v = v ? new Date(v).toISOString() : undefined;
      if (f.type === "boolean") v = Boolean(v);
      if (v === "" && !f.required) v = undefined;
      if (v !== undefined) out[f.key] = v;
    });
    // Only platform admins must specify the target chapter; chapter-scoped
    // admins are auto-scoped by the backend, so we omit chapter_id for them
    // (avoids sending it needlessly / tripping stricter validators).
    if (isNew && isPlatform && actingChapterId) out.chapter_id = actingChapterId;
    return out;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const payload = buildPayload();
      if (isNew) await client.create(payload);
      else await client.update(id, payload);
      navigate(`/admin/r/${cfg.key}`);
    } catch (err) {
      setError(err.message || "Save failed");
      if (Array.isArray(err.errors)) {
        const fe = {};
        err.errors.forEach((x) => (fe[x.field] = x.message));
        setFieldErrors(fe);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="csa-empty"><span className="csa-spin" /> Loading…</div>;

  return (
    <form onSubmit={submit}>
      <button
        type="button"
        className="csa-back-link"
        onClick={() => navigate(`/admin/r/${cfg.key}`)}
      >
        <ChevronLeft size={15} /> Back to {cfg.label}
      </button>
      <h1 className="csa-page-title" style={{ marginBottom: 18 }}>
        {isNew ? `New ${cfg.label}` : `Edit ${cfg.label}`}
      </h1>
      {error && <div className="csa-error-banner">{error}</div>}
      <div className="csa-card csa-card-pad">
        <div className="csa-form-grid">
          {cfg.fields.map((f) => (
            <div key={f.key} className={`csa-field ${f.colSpan === 2 ? "col-span-2" : ""}`}>
              <label className="csa-label">
                {f.label}
                {f.required && " *"}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  className="csa-admin-textarea"
                  value={values[f.key] ?? ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  required={f.required}
                />
              ) : f.type === "boolean" ? (
                <label className="csa-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(values[f.key])}
                    onChange={(e) => setField(f.key, e.target.checked)}
                  />
                  <span className="csa-toggle-track" />
                  <span className="csa-toggle-label">
                    {values[f.key] ? "Enabled" : "Disabled"}
                  </span>
                </label>
              ) : f.type === "select" ? (
                <select
                  className="csa-admin-select"
                  value={values[f.key] ?? ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                >
                  <option value="">-</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="csa-admin-input"
                  type={f.type === "number" ? "number" : f.type === "datetime" ? "datetime-local" : f.type === "url" ? "url" : "text"}
                  value={values[f.key] ?? ""}
                  placeholder={f.placeholder || ""}
                  onChange={(e) => setField(f.key, e.target.value)}
                  required={f.required}
                />
              )}
              {(f.type === "text" || f.type === "url") &&
                /img|image|photo|logo|avatar/i.test(f.key) &&
                typeof values[f.key] === "string" &&
                values[f.key].trim() !== "" && (
                  <div className="csa-img-preview">
                    <img
                      src={values[f.key]}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}
              {fieldErrors[f.key] && <span className="csa-field-error">{fieldErrors[f.key]}</span>}
            </div>
          ))}
        </div>
        <div className="csa-form-actions">
          <button type="button" className="csa-btn" onClick={() => navigate(`/admin/r/${cfg.key}`)}>Cancel</button>
          <button className="csa-btn csa-btn-primary" disabled={saving}>
            {saving ? <span className="csa-spin" /> : isNew ? "Create" : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
