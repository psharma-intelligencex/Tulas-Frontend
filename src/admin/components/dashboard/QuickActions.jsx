// Quick-action buttons for the dashboard header - jump straight to the "new"
// form for the most common content types.
import { useNavigate } from "react-router-dom";
import { FileText, CalendarPlus, Megaphone, UsersRound } from "lucide-react";

const ACTIONS = [
  { label: "New Blog", to: "/admin/r/blogs/new", Icon: FileText },
  { label: "New Event", to: "/admin/r/site-events/new", Icon: CalendarPlus },
  { label: "New Announcement", to: "/admin/r/announcements/new", Icon: Megaphone },
  { label: "Add Team Member", to: "/admin/r/site-team/new", Icon: UsersRound },
];

export default function QuickActions() {
  const navigate = useNavigate();
  return (
    <div className="csa-dash-actions">
      {ACTIONS.map(({ label, to, Icon }, i) => (
        <button
          key={to}
          className={`csa-btn ${i === 0 ? "csa-btn-primary" : ""} csa-btn-sm`}
          onClick={() => navigate(to)}
        >
          <Icon size={15} /> {label}
        </button>
      ))}
    </div>
  );
}
