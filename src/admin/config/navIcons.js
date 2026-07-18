// Shared icon map for resources + static nav destinations, used by both the
// sidebar (AdminLayout) and the list-page headers (ResourceList).
import {
  LayoutDashboard, FileText, GraduationCap, Users2, HeartHandshake,
  CalendarDays, UsersRound, Megaphone, Award, Handshake, HelpCircle,
  CalendarClock, Inbox, Building2, UserCog, ScrollText, Sparkles,
} from "lucide-react";

export const RESOURCE_ICONS = {
  blogs: FileText,
  alumni: GraduationCap,
  committees: Users2,
  csr: HeartHandshake,
  events: CalendarDays,
  heads: UsersRound,
  "core-members": UsersRound,
  announcements: Megaphone,
  sponsors: Award,
  partners: Handshake,
  faqs: HelpCircle,
  "site-events": CalendarClock,
  "site-team": UsersRound,
};

export const STATIC_ICONS = {
  "/admin": LayoutDashboard,
  "/admin/submissions": Inbox,
  "/admin/platform/chapters": Building2,
  "/admin/platform/users": UserCog,
  "/admin/platform/audit": ScrollText,
};

export const iconForResource = (key) => RESOURCE_ICONS[key] || Sparkles;
export const iconForLink = (link) =>
  RESOURCE_ICONS[link.key] || STATIC_ICONS[link.to] || Sparkles;
