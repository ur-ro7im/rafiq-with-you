import { fetchAdhkarGroup } from "./adhkar";
import { fetchSection } from "./hadith";
import { fetchAyahByNumber } from "./quran";
import { ADHKAR_GROUPS } from "../constants/adhkar";
import { COLLECTIONS } from "../constants/hadith";
import { daySeed, seededRandom } from "../utils/daily";
import { stripBasmala } from "../utils/quran";
import { normalizeArabic } from "../utils/text";

const TOTAL_AYAHS = 6236;

export async function loadAyahOfDay(signal, date = new Date()) {
  const random = seededRandom(1, date);
  let last;
  // نتجنب الآيات القصيرة جدًا (مثل الحروف المقطّعة) لتكون الآية مفيدة للقارئ
  for (let attempt = 0; attempt < 4; attempt++) {
    const number = Math.floor(random() * TOTAL_AYAHS) + 1;
    const ayah = await fetchAyahByNumber(number, signal);
    last = {
      surah: ayah.surah.number,
      surahName: ayah.surah.name,
      ayah: ayah.numberInSurah,
      text: stripBasmala(ayah.text, ayah.surah.number, ayah.numberInSurah),
    };
    if (normalizeArabic(last.text).length >= 25) break;
  }
  return last;
}

export async function loadHadithOfDay(signal, date = new Date()) {
  const random = seededRandom(2, date);
  const collection = COLLECTIONS[daySeed(date) % COLLECTIONS.length];

  for (let attempt = 0; attempt < 4; attempt++) {
    const section = Math.floor(random() * collection.books) + 1;
    try {
      const { hadiths } = await fetchSection(
        collection.edition,
        section,
        signal,
      );
      const short = hadiths.filter(
        (h) => h.text.length >= 60 && h.text.length <= 450,
      );
      const pool = short.length ? short : hadiths;
      if (!pool.length) continue;
      const hadith = pool[Math.floor(random() * pool.length)];
      return { collectionId: collection.id, section, hadith };
    } catch (err) {
      if (signal?.aborted) throw err;
    }
  }
  throw new Error("no hadith available");
}

export async function loadDhikrOfDay(signal, date = new Date()) {
  const groups = ADHKAR_GROUPS.filter((g) => g.daily);
  const lists = await Promise.all(
    groups.map(async (group) => ({
      group,
      items: (await fetchAdhkarGroup(group, signal)).flatMap((s) => s.items),
    })),
  );

  const seen = new Set();
  const pool = lists
    .flatMap(({ group, items }) =>
      items.map((item) => ({ ...item, groupId: group.id })),
    )
    .filter(
      (item) =>
        item.text.length <= 500 && !seen.has(item.text) && seen.add(item.text),
    );

  if (!pool.length) throw new Error("no adhkar available");
  return pool[Math.floor(seededRandom(3, date)() * pool.length)];
}
