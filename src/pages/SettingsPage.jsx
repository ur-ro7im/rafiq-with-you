import { useSettings } from "../context/settings-context";
import { CITIES, METHODS } from "../constants/app";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";
import InstallCard from "../components/ui/InstallCard";

const THEMES = [
  ["light", "فاتح"],
  ["dark", "داكن"],
  ["system", "تلقائي"],
];

export default function SettingsPage() {
  const { settings, update, reset } = useSettings();
  return (
    <>
      <SectionHeader title="الإعدادات" subtitle="تُحفظ على جهازك فقط" />
      <IslamicCard>
        <div className="field">
          <span className="lbl" id="theme-lbl">
            المظهر
          </span>
          <div className="seg" role="group" aria-labelledby="theme-lbl">
            {THEMES.map(([v, l]) => (
              <button
                key={v}
                aria-pressed={settings.theme === v}
                onClick={() => update({ theme: v })}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="field">
          <label htmlFor="city">المدينة</label>
          <select
            id="city"
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
          <label htmlFor="method">طريقة حساب المواقيت</label>
          <select
            id="method"
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
        <button className="btn" onClick={reset}>
          استعادة الإعدادات الافتراضية
        </button>
      </IslamicCard>
      <InstallCard />
    </>
  );
}
