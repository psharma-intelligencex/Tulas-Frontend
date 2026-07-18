// Admin dashboard: a welcome header + quick actions, a KPI tile row (content
// counts for the acting chapter), and an operational widget grid (upcoming
// events, recent submissions, recent activity, content breakdown).
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText, CalendarDays, UsersRound, Users2, GraduationCap,
  HeartHandshake, Megaphone, Award, Building2,
} from "lucide-react";
import { resource as makeResource } from "../api/client.js";
import { RESOURCES } from "../config/resources.js";
import { useAuth } from "../auth/AuthContext.jsx";
import QuickActions from "../components/dashboard/QuickActions.jsx";
import UpcomingEvents from "../components/dashboard/UpcomingEvents.jsx";
import RecentSubmissions from "../components/dashboard/RecentSubmissions.jsx";
import RecentActivity from "../components/dashboard/RecentActivity.jsx";
import ContentBreakdown from "../components/dashboard/ContentBreakdown.jsx";

const TILES = [
  { key: "blogs", Icon: FileText },
  { key: "events", Icon: CalendarDays },
  { key: "heads", Icon: UsersRound },
  { key: "committees", Icon: Users2 },
  { key: "alumni", Icon: GraduationCap },
  { key: "csr", Icon: HeartHandshake },
  { key: "announcements", Icon: Megaphone },
  { key: "sponsors", Icon: Award },
];

export default function Dashboard() {
  const { me, actingChapter } = useAuth();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        TILES.map(async ({ key }) => {
          const cfg = RESOURCES.find((r) => r.key === key);
          if (!cfg) return [key, null];
          try {
            const { meta, data } = await makeResource(cfg.api).list({ limit: 1 });
            return [key, meta?.total ?? (data?.length ?? 0)];
          } catch {
            return [key, null];
          }
        })
      );
      if (!cancelled) setCounts(Object.fromEntries(entries));
    })();
    return () => {
      cancelled = true;
    };
  }, [actingChapter]);

  const name = me?.user?.full_name || me?.user?.email || "Admin";

  return (
    <div>
      <div className="csa-dash-header">
        <div>
          <h1 className="csa-dash-hello">Welcome back, {name}</h1>
          <p className="csa-dash-sub">
            Here&apos;s what&apos;s happening across{" "}
            <span className="csa-dash-chip"><Building2 size={13} /> {actingChapter || "your chapter"}</span>
          </p>
        </div>
        <QuickActions />
      </div>

      <div className="csa-stats">
        {TILES.map(({ key, Icon }) => {
          const cfg = RESOURCES.find((r) => r.key === key);
          if (!cfg) return null;
          return (
            <Link key={key} to={`/admin/r/${key}`} className="csa-stat">
              <div className="csa-stat-coin"><Icon /></div>
              <div>
                <div className="csa-stat-value">{counts[key] == null ? "-" : counts[key]}</div>
                <div className="csa-stat-label">{cfg.label}</div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="csa-dash-grid">
        <UpcomingEvents />
        <RecentSubmissions />
        <RecentActivity />
        <ContentBreakdown />
      </div>
    </div>
  );
}
