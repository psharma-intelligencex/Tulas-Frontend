import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { api } from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";

const PILL_BY_STATUS = {
  draft: "csa-pill-slate",
  cancelled: "csa-pill-amber",
  past: "csa-pill-slate",
  ongoing: "csa-pill-green",
  published: "csa-pill-sky",
};

function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";
  const diff = Date.now() - then.getTime();
  const abs = Math.abs(diff);
  const min = 60 * 1000;
  const hour = 60 * min;
  const day = 24 * hour;
  if (abs < min) return "just now";
  if (abs < hour) {
    const n = Math.round(abs / min);
    return diff >= 0 ? `${n}m ago` : `in ${n}m`;
  }
  if (abs < day) {
    const n = Math.round(abs / hour);
    return diff >= 0 ? `${n}h ago` : `in ${n}h`;
  }
  if (abs < 7 * day) {
    const n = Math.round(abs / day);
    return diff >= 0 ? `${n}d ago` : `in ${n}d`;
  }
  return then.toLocaleDateString();
}

function shortDate(iso) {
  if (!iso) return "TBD";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

function SkeletonRows() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <div className="csa-wrow" key={i}>
          <span
            className="csa-skel"
            style={{ width: 34, height: 34, borderRadius: 9 }}
          />
          <div className="csa-wrow-main">
            <div className="csa-skel" style={{ height: 12, width: "70%" }} />
            <div
              className="csa-skel"
              style={{ height: 10, width: "40%", marginTop: 6 }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default function UpcomingEvents() {
  const { actingChapter } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/events", {
          params: { upcoming: true, order: "asc", limit: 5 },
        });
        const list = res?.data?.data;
        if (!cancelled) setRows(Array.isArray(list) ? list : []);
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
          <CalendarDays /> Upcoming Events
        </span>
        <Link className="csa-widget-link" to="/admin/r/site-events">
          View all
        </Link>
      </div>
      <div className="csa-widget-body">
        {loading ? (
          <SkeletonRows />
        ) : rows.length === 0 ? (
          <div className="csa-widget-empty">No upcoming events.</div>
        ) : (
          rows.map((ev) => {
            const secondary = ev.venue || ev.category || "";
            const showPill = ev.status && ev.status !== "upcoming";
            return (
              <div className="csa-wrow" key={ev.id ?? ev.slug}>
                <span className="csa-wrow-icon">
                  <CalendarDays />
                </span>
                <div className="csa-wrow-main">
                  <div className="csa-wrow-title">
                    {ev.title || "Untitled event"}
                  </div>
                  <div className="csa-wrow-sub">
                    {secondary}
                    {showPill ? (
                      <span
                        className={`csa-pill ${
                          PILL_BY_STATUS[ev.status] || "csa-pill-slate"
                        }`}
                      >
                        {ev.status}
                      </span>
                    ) : null}
                  </div>
                </div>
                <span className="csa-wrow-meta">
                  {shortDate(ev.start_date_time)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
