import { createContext, useContext } from "react";

export const PrayerTimesContext = createContext(null);
export const usePrayerData = () => useContext(PrayerTimesContext);
