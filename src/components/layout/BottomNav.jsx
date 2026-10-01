import { Link, useLocation } from "react-router-dom";
import { BookOpen, Clock3, Home, Menu, Sparkles } from "lucide-react";

const TABS = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/prayer-times", label: "المواقيت", icon: Clock3 },
  { to: "/quran", label: "القرآن", icon: BookOpen },
  { to: "/adhkar", label: "الأذكار", icon: Sparkles },
];

export default function BottomNav({ onMore, moreOpen }) {
  const { pathname } = useLocation();
  const isActive = (to) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <nav className="bottom-nav" aria-label="التنقل السريع">
      {TABS.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className={isActive(to) ? "active" : ""}
          aria-current={isActive(to) ? "page" : undefined}
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
      <button
        type="button"
        onClick={onMore}
        aria-expanded={moreOpen}
        aria-haspopup="dialog"
      >
        <Menu size={22} aria-hidden="true" />
        <span>المزيد</span>
      </button>
    </nav>
  );
}
