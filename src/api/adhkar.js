import { getJson } from "./http";
import { normalizeArabic } from "../utils/text";

const HISN_URL =
  "https://cdn.jsdelivr.net/gh/rn0x/Adhkar-json@main/adhkar.json";
const DAILY_URL =
  "https://cdn.jsdelivr.net/gh/Seen-Arabic/Morning-And-Evening-Adhkar-DB@main/ar.json";

// نقارن العناوين بالحروف العربية فقط لتجاهل التشكيل والمسافات والرموز
const key = (title) => normalizeArabic(title).replace(/[^\u0621-\u064A]/g, "");

const fromHisn = (category) => ({
  title: category.category,
  items: category.array.map((a) => ({
    id: `${category.id}.${a.id}`,
    text: a.text,
    count: Number(a.count) || 1,
  })),
});

async function fetchDaily(kind, signal) {
  try {
    const raw = await getJson(DAILY_URL, signal);
    const rows = Array.isArray(raw) ? raw : Object.values(raw).flat();
    const wanted = kind === "morning" ? [0, 1] : [0, 2];
    const items = rows
      .filter((r) => r.content && wanted.includes(Number(r.type ?? 0)))
      .map((r, i) => ({
        id: String(r.order ?? i),
        text: r.content,
        count: Number(r.count) || 1,
        fadl: r.fadl || null,
        source: r.source || null,
      }));
    if (items.length) return [{ title: null, items }];
  } catch (err) {
    if (err.name === "AbortError") throw err;
  }
  // المصدر الاحتياطي: فئة الصباح والمساء من حصن المسلم
  const hisn = await getJson(HISN_URL, signal);
  const shared = hisn.find(
    (c) => key(c.category) === key("أذكار الصباح والمساء"),
  );
  return shared ? [{ ...fromHisn(shared), title: null }] : [];
}

export async function fetchAdhkarGroup(group, signal) {
  if (group.daily) return fetchDaily(group.daily, signal);

  const hisn = await getJson(HISN_URL, signal);
  return group.categories
    .map((title) => hisn.find((c) => key(c.category) === key(title)))
    .filter(Boolean)
    .map(fromHisn);
}
