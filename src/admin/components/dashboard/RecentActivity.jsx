import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  LogIn,
  LogOut,
  KeyRound,
  FilePlus,
  Pencil,
  Trash2,
} from "lucide-react";
import { api } from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";

function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";
  const diff = Date.now() - then.getTime();
  if (diff < 0) return "just now";
  const sec = Math.floor(diff / 1000);
  if (sec < 45) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return min + "m ago";
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + "h ago";
  const day = Math.floor(hr / 24);
  if (day <= 7) return day + "d ago";
  return then.toLocaleDateString();
}

const ACTION_LABELS = {
  "auth.login": "Signed in",
  "auth.logout": "Signed out",
  "auth.password_reset": "Password reset",
};

function humanizeAction(action) {
  if (!action) return "Activity";
  if (ACTION_LABELS[action]) return ACTION_LABELS[action];
  const words = String(action)
    .replace(/[._]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w));
  return words.join(" ") || "Activity";
}

function iconForAction(action) {
  const a = String(action || "").toLowerCase();
  if (a === "auth.login" || a.endsWith(".login")) return LogIn;
  if (a === "auth.logout" || a.endsWith(".logout")) return LogOut;
  if (a.includes("password") || a.includes("reset")) return KeyRound;
  if (a.includes("create") || a.includes("add")) return FilePlus;
  if (a.includes("update") || a.includes("edit")) return Pencil;
  if (a.includes("delete") || a.includes("remove") || a.includes("destroy"))
    return Trash2;
  return Activity;
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

export default function RecentActivity() {
  const { actingChapter } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/audit", { params: { limit: 8 } });
        const list = res?.data?.data || [];
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
          <Activity /> Recent Activity
        </span>
        <Link className="csa-widget-link" to="/admin/platform/audit">
          View all
        </Link>
      </div>
      <div className="csa-widget-body">
        {loading ? (
          <SkeletonRows />
        ) : rows.length === 0 ? (
          <div className="csa-widget-empty">No recent activity.</div>
        ) : (
          rows.map((r) => {
            const Icon = iconForAction(r.action);
            const title = humanizeAction(r.action);
            const entityId = r.entity_id ? String(r.entity_id) : "";
            const sub =
              (r.entity || "") +
              (entityId ? " #" + entityId.slice(0, 8) : "");
            return (
              <div className="csa-wrow" key={r.id}>
                <span className="csa-wrow-icon">
                  <Icon />
                </span>
                <div className="csa-wrow-main">
                  <div className="csa-wrow-title">{title}</div>
                  <div className="csa-wrow-sub">{sub || "-"}</div>
                </div>
                <span className="csa-wrow-meta">
                  {relativeTime(r.created_at)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
