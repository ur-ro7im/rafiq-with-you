import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

// التقدم يخص اليوم الحالي فقط ويبدأ من الصفر في اليوم التالي
export function useDhikrProgress() {
  const today = new Date().toDateString();
  const [store, setStore] = useLocalStorage("adhkar-progress", {
    day: today,
    counts: {},
  });
  const counts = store.day === today ? store.counts : {};

  const update = useCallback(
    (change) =>
      setStore((prev) => {
        const base = prev.day === today ? prev.counts : {};
        return { day: today, counts: change(base) };
      }),
    [setStore, today],
  );

  return {
    counts,
    tap: (id, max) =>
      update((c) => ({ ...c, [id]: Math.min(max, (c[id] ?? 0) + 1) })),
    finish: (id, max) => update((c) => ({ ...c, [id]: max })),
    reset: (ids) =>
      update((c) =>
        Object.fromEntries(
          Object.entries(c).filter(([id]) => !ids.includes(id)),
        ),
      ),
  };
}
