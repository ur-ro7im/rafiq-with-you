import { getJson } from "./http";

const BASE = "https://api.aladhan.com/v1";

export async function fetchTimingsByCity(
  { city, method = 5, school = 0, country = "Egypt" },
  signal,
) {
  const qs = new URLSearchParams({ city, country, method, school });
  const res = await fetch(`${BASE}/timingsByCity?${qs}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { data } = await res.json();
  return {
    timings: data.timings,
    hijri: data.date.hijri,
    meta: { latitude: data.meta.latitude, longitude: data.meta.longitude },
  };
}

export async function fetchHijriMonth(month, year) {
  const { data } = await getJson(`${BASE}/gToHCalendar/${month}/${year}`);
  return data;
}
