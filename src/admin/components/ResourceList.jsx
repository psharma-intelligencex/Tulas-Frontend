// Generic list view for any RESOURCES entry: search, paginated table, and
// row actions (edit / delete). Columns and the target API come from config.
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resource as makeResource } from "../api/client.js";
import { RESOURCE_BY_KEY } from "../config/resources.js";
import { useAuth } from "../auth/AuthContext.jsx";
import { iconForResource } from "../config/navIcons.js";
import { RESOURCE_DESC } from "../config/resources.js";

const cellValue = (row, col) => {
  const v = row[col.key];
  if (col.type === "image")
    return v ? <img className="csa-thumb" src={v} alt="" loading="lazy" /> : <span className="csa-muted">-</span>;
  if (col.type === "boolean")
    return (
      <span className={`csa-badge ${v ? "csa-badge-success" : "csa-badge-danger"}`}>
        {v ? "Yes" : "No"}
      </span>
    );
  if (v == null || v === "") return <span className="csa-muted">-</span>;
  const s = String(v);
  return s.length > 60 ? s.slice(0, 60) + "…" : s;
};

export default function ResourceList() {
  const { resourceKey } = useParams();
  const cfg = RESOURCE_BY_KEY[resourceKey];
  const navigate = useNavigate();
  const { actingChapter } = useAuth();

  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const client = cfg ? makeResource(cfg.api) : null;

  const load = useCallback(async () => {
    if (!client) return;
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 20 };
      if (q) params.search = q;
      const { data, meta } = await client.list(params);
      setRows(data || []);
      setMeta(meta || { page: 1, totalPages: 1, total: (data || []).length });
    } catch (err) {
      setError(err.message || "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg?.api, page, q, actingChapter]);

  useEffect(() => {
    setPage(1);
  }, [resourceKey, actingChapter]);
  useEffect(() => {
    load();
  }, [load]);

  if (!cfg) return <div className="csa-empty">Unknown resource.</div>;

  const onDelete = async (row) => {
    if (!window.confirm(`Delete this ${cfg.label.toLowerCase()} item? This cannot be undone.`)) return;
    try {
      await client.remove(row[cfg.idKey]);
      load();
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="csa-page-head">
        <div>
          <h1 className="csa-page-title">
            {(() => {
              const I = iconForResource(cfg.key);
              return <I />;
            })()}{" "}
            {cfg.label}{" "}
            {meta.total > 0 && <span className="csa-page-count">{meta.total}</span>}
          </h1>
          {RESOURCE_DESC[cfg.key] && <p className="csa-page-desc">{RESOURCE_DESC[cfg.key]}</p>}
        </div>
        <button className="csa-btn csa-btn-primary" onClick={() => navigate(`/admin/r/${cfg.key}/new`)}>
          + New {cfg.label}
        </button>
      </div>

      <div className="csa-toolbar">
        <div className="csa-toolbar-left">
          <input
            className="csa-admin-input csa-search"
            placeholder={`Search ${cfg.label.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (setQ(search), setPage(1))}
          />
          <button className="csa-btn" onClick={() => (setQ(search), setPage(1))}>Search</button>
          {q && (
            <button className="csa-btn" onClick={() => (setSearch(""), setQ(""), setPage(1))}>Clear</button>
          )}
        </div>
      </div>

      {error && <div className="csa-error-banner">{error}</div>}

      <div className="csa-card csa-table-wrap">
        <table className="csa-table">
          <thead>
            <tr>
              {cfg.columns.map((c) => (
                <th key={c.key}>{c.label || ""}</th>
              ))}
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr className="csa-skel-row" key={`skel-${i}`}>
                  {cfg.columns.map((c) => (
                    <td key={c.key}>
                      {c.type === "image" ? (
                        <span className="csa-skel" style={{ width: 40, height: 40, borderRadius: 8, display: "block" }} />
                      ) : (
                        <span className="csa-skel" style={{ height: 12, width: "70%", display: "block" }} />
                      )}
                    </td>
                  ))}
                  <td>
                    <span className="csa-skel" style={{ height: 12, width: "70%", display: "block" }} />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={cfg.columns.length + 1}>
                  <div className="csa-empty-state">
                    <div className="csa-empty-state-icon">
                      {(() => {
                        const I = iconForResource(cfg.key);
                        return <I />;
                      })()}
                    </div>
                    <h3>No {cfg.label.toLowerCase()} yet</h3>
                    <p>Create the first one to get started.</p>
                    <button className="csa-btn csa-btn-primary" onClick={() => navigate(`/admin/r/${cfg.key}/new`)}>
                      + New {cfg.label}
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row[cfg.idKey]}>
                  {cfg.columns.map((c) => (
                    <td key={c.key}>{cellValue(row, c)}</td>
                  ))}
                  <td>
                    <div className="csa-table-actions">
                      <button className="csa-btn csa-btn-sm" onClick={() => navigate(`/admin/r/${cfg.key}/${row[cfg.idKey]}`)}>Edit</button>
                      <button className="csa-btn csa-btn-sm csa-btn-danger" onClick={() => onDelete(row)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="csa-pagination">
        <span>{meta.total} total</span>
        <button className="csa-btn csa-btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {meta.page} / {meta.totalPages}</span>
        <button className="csa-btn csa-btn-sm" disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
