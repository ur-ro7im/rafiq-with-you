import { Link, useLocation } from "react-router-dom";
import { NAV_GROUPS, NAV_ITEMS } from "../../constants/navigation";
import { APP_NAME } from "../../constants/app";
import InstallCard from "../ui/InstallCard";

// أطول مسار يطابق الصفحة الحالية هو العنصر النشط (يشمل صفحات مثل /quran/2)
function activePath(pathname) {
  const matches = NAV_ITEMS.filter(
    ({ to }) =>
      pathname === to || (to !== "/" && pathname.startsWith(`${to}/`)),
  );
  return matches.sort((a, b) => b.to.length - a.to.length)[0]?.to;
}

export default function Sidebar({ open, onNavigate }) {
  const { pathname } = useLocation();
  const current = activePath(pathname);

  return (
    <aside
      className={`sidebar ${open ? "open" : ""}`}
      aria-label="التنقل الرئيسي"
    >
      <div className="brand">
        <img src="/imgs/icon.png" alt="" />
        {APP_NAME}
      </div>
      <nav>
        {NAV_GROUPS.map((group, i) => (
          <div key={i}>
            {group.title && <div className="nav-title">{group.title}</div>}
            {group.items.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={onNavigate}
                aria-current={current === to ? "page" : undefined}
                className={`nav-link ${current === to ? "active" : ""}`}
              >
                <Icon size={19} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <InstallCard />
    </aside>
  );
}
