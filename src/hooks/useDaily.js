import { useAsync } from "./useAsync";
import { dayKey } from "../utils/daily";

function readToday(key, day) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return saved?.day === day ? saved.data : null;
  } catch {
    return null;
  }
}

// يحمّل المحتوى مرة واحدة في اليوم ثم يعرضه من الجهاز في باقي الزيارات
export function useDaily(name, load) {
  const day = dayKey();

  return useAsync(
    async (signal) => {
      const key = `daily:${name}`;
      const cached = readToday(key, day);
      if (cached) return cached;

      const data = await load(signal);
      try {
        localStorage.setItem(key, JSON.stringify({ day, data }));
      } catch {
        // storage unavailable
      }
      return data;
    },
    [name, day],
  );
}
