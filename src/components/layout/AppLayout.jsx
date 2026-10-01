import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import { APP_NAME } from "../../constants/app";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="btn icon-btn"
          aria-label="فتح القائمة"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={22} />
        </button>
        <strong style={{ color: "var(--primary)" }}>{APP_NAME}</strong>
        <Link
          to="/search"
          className="btn icon-btn topbar-search"
          aria-label="بحث"
        >
          <Search size={20} />
        </Link>
      </header>
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      <div
        className={`backdrop ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
        <footer className="footer">
          <div>
            © {new Date().getFullYear()} {APP_NAME} — منصة إسلامية تجمع مواقيت
            الصلاة والقرآن والأذكار وغيرها.
          </div>
          <div>
            تم إنشاء هذه المنصة بواسطة رحيم غانم — صدقة جارية له بعد وفاته، نسأل
            الله أن يجعلها في ميزان حسناته.
          </div>
        </footer>
      </main>
      <BottomNav onMore={() => setOpen(true)} moreOpen={open} />
    </div>
  );
}
