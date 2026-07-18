import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  MessageSquare,
  HandHeart,
  Mic,
  Building2,
} from "lucide-react";
import { api } from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";

const TYPE_META = {
  contact: { icon: MessageSquare, pill: "csa-pill-indigo", label: "contact" },
  volunteer: { icon: HandHeart, pill: "csa-pill-green", label: "volunteer" },
  speaker: { icon: Mic, pill: "csa-pill-amber", label: "speaker" },
  "sponsor-inquiry": { icon: Building2, pill: "csa-pill-sky", label: "sponsor" },
};

const INBOXES = ["contact", "volunteer", "speaker", "sponsor-inquiry"];

function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diff = Date.now() - then;
  if (diff < 0) return "just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function RecentSubmissions() {
  const { actingChapter } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          INBOXES.map((type) =>
            api
              .get(`/admin/submissions/${type}`, { params: { limit: 5 } })
              .then((res) => ({ type, data: res?.data?.data || [] }))
              .catch(() => ({ type, data: [] }))
          )
        );

        const merged = [];
        for (const { type, data } of results) {
          for (const row of data) {
            merged.push({ ...row, __type: type });
          }
        }
        merged.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        if (!cancelled) setRows(merged.slice(0, 6));
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actingChapter]);

  return (
    <div className="csa-widget">
      <div className="csa-widget-head">
        <span className="csa-widget-title">
          <Inbox /> Recent Submissions
        </span>
        <Link className="csa-widget-link" to="/admin/submissions">
          View all
        </Link>
      </div>
      <div className="csa-widget-body">
        {loading ? (
          <>
            {[0, 1, 2, 3].map((i) => (
              <div className="csa-wrow" key={i}>
                <span
                  className="csa-skel"
                  style={{ width: 34, height: 34, borderRadius: 9 }}
                />
                <div className="csa-wrow-main">
                  <div
                    className="csa-skel"
                    style={{ height: 12, width: "70%" }}
                  />
                  <div
                    className="csa-skel"
                    style={{ height: 10, width: "40%", marginTop: 6 }}
                  />
                </div>
              </div>
            ))}
          </>
        ) : rows.length === 0 ? (
          <div className="csa-widget-empty">Nothing yet.</div>
        ) : (
          rows.map((row, idx) => {
            const meta = TYPE_META[row.__type] || TYPE_META.contact;
            const Icon = meta.icon;
            const isSponsor = row.__type === "sponsor-inquiry";
            const title = isSponsor
              ? row.org_name || row.contact_name || "Sponsor inquiry"
              : row.name || "Unknown";
            const email = row.email || "";
            return (
              <div className="csa-wrow" key={row.id ?? `${row.__type}-${idx}`}>
                <span className="csa-wrow-icon">
                  <Icon />
                </span>
                <div className="csa-wrow-main">
                  <div className="csa-wrow-title">
                    {title}{" "}
                    <span className={`csa-pill ${meta.pill}`}>{meta.label}</span>
                  </div>
                  <div className="csa-wrow-sub">{email}</div>
                </div>
                <span className="csa-wrow-meta">
                  {relativeTime(row.created_at)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
