import { useEffect, useState } from "react";
import { resource } from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import { Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";

const SOURCES = [
  { label: "Blogs", base: "/admin/legacy/blogs" },
  { label: "Events", base: "/admin/events" },
  { label: "Team", base: "/admin/team" },
  { label: "Committees", base: "/admin/legacy/committees" },
  { label: "Alumni", base: "/admin/legacy/alumni" },
  { label: "CSR", base: "/admin/legacy/csr" },
];

export default function ContentBreakdown() {
  const { actingChapter } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          SOURCES.map(async (s) => {
            try {
              const res = await resource(s.base).list({ limit: 1 });
              const total = res?.meta?.total ?? res?.data?.length ?? 0;
              return { label: s.label, total };
            } catch {
              return { label: s.label, total: 0 };
            }
          })
        );
        if (!cancelled) setRows(results);
      } catch {
        if (!cancelled)
          setRows(SOURCES.map((s) => ({ label: s.label, total: 0 })));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actingChapter]);

  const max = rows.reduce((m, r) => (r.total > m ? r.total : m), 0);

  return (
    <div className="csa-widget">
      <div className="csa-widget-head">
        <span className="csa-widget-title">
          <BarChart3 /> Content Overview
        </span>
        <Link className="csa-widget-link" to="/admin">
          View all
        </Link>
      </div>
      <div className="csa-widget-body csa-pad">
        {loading
          ? SOURCES.map((s, i) => (
              <div className="csa-bar-row" key={i}>
                <span className="csa-bar-label">
                  <span
                    className="csa-skel"
                    style={{ height: 12, width: 48 }}
                  />
                </span>
                <div className="csa-bar-track">
                  <span
                    className="csa-skel"
                    style={{ height: 8, width: "100%", borderRadius: 6 }}
                  />
                </div>
                <span className="csa-bar-val">
                  <span
                    className="csa-skel"
                    style={{ height: 12, width: 20 }}
                  />
                </span>
              </div>
            ))
          : rows.map((r) => (
              <div className="csa-bar-row" key={r.label}>
                <span className="csa-bar-label">{r.label}</span>
                <div className="csa-bar-track">
                  <div
                    className="csa-bar-fill"
                    style={{ width: (max ? (r.total / max) * 100 : 0) + "%" }}
                  />
                </div>
                <span className="csa-bar-val">{r.total}</span>
              </div>
            ))}
      </div>
    </div>
  );
}
