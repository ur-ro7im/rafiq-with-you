import { useEffect, useState } from "react";
import { PRAYERS } from "../constants/app";

function nextPrayer(timings, now) {
  for (const p of PRAYERS) {
    const [h, m] = timings[p.key].slice(0, 5).split(":").map(Number);
    const at = new Date(now);
    at.setHours(h, m, 0, 0);
    if (at > now) return { prayer: p, at };
  }
  const [h, m] = timings.Fajr.slice(0, 5).split(":").map(Number);
  const at = new Date(now);
  at.setDate(at.getDate() + 1);
  at.setHours(h, m, 0, 0);
  return { prayer: PRAYERS[0], at };
}

export function useCountdown(timings) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!timings) return null;
  const { prayer, at } = nextPrayer(timings, now);
  const total = Math.max(0, Math.floor((at - now) / 1000));
  return {
    prayer,
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

// يتغير فقط عند تبدّل الصلاة القادمة، فلا يعيد رسم المكوّنات كل ثانية
export function useNextKey(timings) {
  const [key, setKey] = useState(null);
  useEffect(() => {
    if (!timings) return;
    const update = () => setKey(nextPrayer(timings, new Date()).prayer.key);
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timings]);
  return key;
}
