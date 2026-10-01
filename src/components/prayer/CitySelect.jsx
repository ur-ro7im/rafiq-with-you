import { CITIES } from "../../constants/app";
import { useSettings } from "../../context/settings-context";

export default function CitySelect() {
  const { settings, update } = useSettings();
  return (
    <label>
      <span style={{ marginInlineEnd: 8 }}>المدينة</span>
      <select
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
    </label>
  );
}
