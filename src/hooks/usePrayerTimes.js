import { useEffect, useState } from "react";
import { fetchTimingsByCity } from "../api/aladhan";

const cacheKey = (city, method, school) =>
  `timings:${city}:${method}:${school}`;

// المواقيت ثابتة طوال اليوم، فنحفظها ونتجنب طلب الشبكة عند كل زيارة
function readCache(city, method, school) {
  try {
    const saved = JSON.parse(
      localStorage.getItem(cacheKey(city, method, school)),
    );
    return saved?.day === new Date().toDateString() && saved.meta
      ? saved
      : null;
  } catch {
    return null;
  }
}

const fromCache = ({ timings, hijri, meta }) => ({
  status: "ready",
  timings,
  hijri,
  meta,
});
const EMPTY = { timings: null, hijri: null, meta: null };

export function usePrayerTimes(city, method, school = 0) {
  const [state, setState] = useState(() => {
    const cached = readCache(city, method, school);
    return cached ? fromCache(cached) : { status: "loading", ...EMPTY };
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const cached = readCache(city, method, school);
    if (cached) {
      setState(fromCache(cached));
      return;
    }

    const ctrl = new AbortController();
    setState((s) => ({ ...s, status: "loading" }));
    fetchTimingsByCity({ city, method, school }, ctrl.signal)
      .then((data) => {
        setState({ status: "ready", ...data });
        try {
          localStorage.setItem(
            cacheKey(city, method, school),
            JSON.stringify({ day: new Date().toDateString(), ...data }),
          );
        } catch {
          // storage unavailable
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error", ...EMPTY });
      });
    return () => ctrl.abort();
  }, [city, method, school, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
