import { Link } from "react-router-dom";
import { Volume2, VolumeX } from "lucide-react";
import { CITIES, METHODS } from "../constants/app";
import { useSettings } from "../context/settings-context";
import { useAzan } from "../context/azan-context";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";

const SCHOOLS = [
  [0, "الجمهور (الشافعي والمالكي والحنبلي)"],
  [1, "الحنفي"],
];

export default function PrayerSettingsPage() {
  const { settings, update } = useSettings();
  const { azanEnabled, toggleAzan } = useAzan();

  return (
    <>
      <SectionHeader
        title="إعدادات مواقيت الصلاة"
        subtitle="تُطبَّق فورًا وتُحفظ على جهازك"
      />
      <IslamicCard>
        <div className="field">
          <label htmlFor="ps-city">المدينة</label>
          <select
            id="ps-city"
            className="select"
            value={settings.city}
            onChange={(e) => update({ city: e.target.value })}
          >
            {CITIES.map((c) => (
              <option key={c.api} value={c.api}>
                {c.ar}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ps-method">طريقة الحساب</label>
          <select
            id="ps-method"
            className="select"
            value={settings.method}
            onChange={(e) => update({ method: Number(e.target.value) })}
          >
            {METHODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.ar}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ps-school">وقت العصر</label>
          <select
            id="ps-school"
            className="select"
            value={settings.school}
            onChange={(e) => update({ school: Number(e.target.value) })}
          >
            {SCHOOLS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <span className="lbl">الأذان عند دخول الوقت</span>
          <button
            type="button"
            className={`btn btn-azan ${azanEnabled ? "is-on" : ""}`}
            aria-pressed={azanEnabled}
            onClick={toggleAzan}
          >
            {azanEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            {azanEnabled ? "مفعّل" : "غير مفعّل"}
          </button>
          <p className="hint">يعمل أثناء فتح الصفحة في المتصفح.</p>
        </div>
        <Link className="btn btn-primary" to="/prayer-times">
          عرض المواقيت
        </Link>
      </IslamicCard>
    </>
  );
}
