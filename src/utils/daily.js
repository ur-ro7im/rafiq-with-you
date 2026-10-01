// اليوم المحلي هو أساس الاختيار، فيرى كل المستخدمين المحتوى نفسه في اليوم نفسه
export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const daySeed = (date = new Date()) =>
  Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
  );

// مولّد أرقام عشوائية ثابت النتيجة لنفس اليوم ونفس الرقم المميّز
export function seededRandom(salt, date = new Date()) {
  let state = (daySeed(date) * 2654435761 + salt * 40503) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
