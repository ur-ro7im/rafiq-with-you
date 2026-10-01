import { PrayerTimesContext } from "./prayer-times-context";
import { useSettings } from "./settings-context";
import { usePrayerTimes } from "../hooks/usePrayerTimes";

export default function PrayerTimesProvider({ children }) {
  const { settings } = useSettings();
  const value = usePrayerTimes(settings.city, settings.method, settings.school);
  return (
    <PrayerTimesContext.Provider value={value}>
      {children}
    </PrayerTimesContext.Provider>
  );
}
