import PrayerWidget from "../components/prayer/PrayerWidget";
import SectionHeader from "../components/ui/SectionHeader";

export default function PrayerTimesPage() {
  return (
    <>
      <SectionHeader
        title="مواقيت الصلاة"
        subtitle="حسب المدينة وطريقة الحساب المختارة في الإعدادات"
      />
      <PrayerWidget />
    </>
  );
}
