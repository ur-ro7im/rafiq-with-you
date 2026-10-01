import { Link } from "react-router-dom";
import { APP_NAME_AR } from "../constants/app";
import { NAV_ITEMS, QUICK_ACCESS } from "../constants/navigation";
import DailyContent from "../components/home/DailyContent";
import PrayerWidget from "../components/prayer/PrayerWidget";
import HeroSearch from "../components/ui/HeroSearch";
import IslamicCard from "../components/ui/IslamicCard";
import SectionHeader from "../components/ui/SectionHeader";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>رفيقك اليومي في طريقك إلى الله</h1>
        <p>
          {APP_NAME_AR} تجمع لك مواقيت الصلاة والقرآن والأحاديث والأذكار
          والتفسير والقبلة في مكان واحد.
        </p>
        <HeroSearch />
        <Link className="btn btn-primary" to="/prayer-times">
          ابدأ الآن
        </Link>
      </section>

      <SectionHeader title="مواقيت الصلاة" />
      <PrayerWidget />

      <SectionHeader title="وصول سريع" />
      <div className="grid grid-quick">
        {QUICK_ACCESS.map((to) => {
          const { label, icon: Icon } = NAV_ITEMS.find((i) => i.to === to);
          return (
            <IslamicCard as={Link} to={to} key={to} className="quick">
              <span className="ico">
                <Icon size={22} aria-hidden="true" />
              </span>
              <strong>{label}</strong>
            </IslamicCard>
          );
        })}
      </div>

      <SectionHeader
        title="محتوى اليوم"
        subtitle="يتجدد كل يوم من مصادر موثّقة"
      />
      <DailyContent />
    </>
  );
}
