// Read-mostly view of inbound form submissions for the acting chapter, grouped
// by type. Contact submissions support a quick status change.
import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { api } from "../api/client.js";
import { useAuth } from "../auth/AuthContext.jsx";

const TABS = [
  { key: "contact", label: "Contact", path: "/admin/submissions/contact", cols: ["name", "email", "subject", "message", "status"] },
  { key: "volunteer", label: "Volunteer", path: "/admin/submissions/volunteer", cols: ["name", "email", "phone", "areas_of_interest", "status"] },
  { key: "speaker", label: "Speaker", path: "/admin/submissions/speaker", cols: ["name", "email", "topic", "status"] },
  { key: "sponsor-inquiry", label: "Sponsor inquiries", path: "/admin/submissions/sponsor-inquiry", cols: ["org_name", "contact_name", "email", "status"] },
];

function statusPillClass(status) {
  const s = String(status || "").toLowerCase();
  if (s === "new") return "csa-pill-indigo";
  if (s === "read" || s === "archived") return "csa-pill-slate";
  if (s === "responded" || s === "accepted") return "csa-pill-green";
  if (s === "reviewing" || s === "pending") return "csa-pill-amber";
  if (s === "rejected") return "csa-pill-slate";
  return "csa-pill-slate";
}

export default function Submissions() {
  const [tab, setTab] = useState(TABS[0].key);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { actingChapter } = useAuth();
  const active = TABS.find((t) => t.key === tab);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .get(active.path, { params: { limit: 50 } })
      .then((res) => !cancelled && setRows(res.data?.data || []))
      .catch((err) => !cancelled && setError(err.response?.data?.message || err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [tab, actingChapter, active.path]);

  return (
    <div>
      <div className="csa-page-head">
        <div>
          <h1 className="csa-page-title"><Inbox /> Submissions</h1>
          <p className="csa-page-desc">Inbound form submissions for your chapter - contact, volunteer, speaker and sponsor enquiries.</p>
        </div>
      </div>

      <div className="csa-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`csa-tab ${t.key === tab ? "active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.key === tab && rows.length > 0 && <span className="csa-tab-count">{rows.length}</span>}
          </button>
        ))}
      </div>

      {error && <div className="csa-error-banner">{error}</div>}

      <div className="csa-card csa-table-wrap">
        <table className="csa-table">
          <thead>
            <tr>
              {active.cols.map((c) => (
                <th key={c}>{c.replace(/_/g, " ")}</th>
              ))}
              <th>received</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {active.cols.map((c) => (
                    <td key={c}><span className="csa-skel" style={{ width: "80%", height: 14, borderRadius: 4 }} /></td>
                  ))}
                  <td><span className="csa-skel" style={{ width: 60, height: 14, borderRadius: 4 }} /></td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={active.cols.length + 1}>
                  <div className="csa-empty-state">
                    <div className="csa-empty-state-icon"><Inbox /></div>
                    <h3>No submissions yet</h3>
                    <p>New {active.label.toLowerCase()} submissions for your chapter will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {active.cols.map((c) => {
                    const v = row[c];
                    if (c === "status" && v != null) {
                      return (
                        <td key={c}>
                          <span className={`csa-pill ${statusPillClass(v)}`}>{String(v)}</span>
                        </td>
                      );
                    }
                    const s = v == null ? "-" : String(v);
                    return <td key={c}>{s.length > 70 ? s.slice(0, 70) + "…" : s}</td>;
                  })}
                  <td className="csa-muted">{row.created_at ? new Date(row.created_at).toLocaleDateString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
