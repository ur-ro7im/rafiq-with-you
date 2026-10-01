import { getJson } from "./http";

const BASE = "https://api.alquran.cloud/v1";
const LIST_KEY = "surah-list";

export const ayahAudioUrl = (globalNumber) =>
  `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNumber}.mp3`;

export async function fetchSurahs(signal) {
  try {
    const saved = JSON.parse(localStorage.getItem(LIST_KEY));
    if (saved?.length === 114) return saved;
  } catch {
    // ignore and refetch
  }
  const { data } = await getJson(`${BASE}/surah`, signal);
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(data));
  } catch {
    // storage full or blocked
  }
  return data;
}

export async function fetchSurah(id, signal) {
  const { data } = await getJson(`${BASE}/surah/${id}/quran-uthmani`, signal);
  return data;
}

export async function fetchTafsir(surahId, edition, signal) {
  const { data } = await getJson(`${BASE}/surah/${surahId}/${edition}`, signal);
  return data.ayahs.map((a) => a.text);
}
//  `${BASE}/search/${keyword}/all/quran-simple`,
export async function searchQuran(query, signal) {
  // console.log(query,signal)
  const keyword = encodeURIComponent(query.trim());
  try {
    const { data } = await getJson(
      `${BASE}/search/${keyword}/all/quran-simple`,
      signal,
    );
    return { count: data.count, matches: data.matches };
  } catch (err) {
    // الخدمة ترجع 404 عندما لا توجد نتائج
    if (err.message === "HTTP 404") return { count: 0, matches: [] };
    throw err;
  }
}

export async function fetchAyahByNumber(number, signal) {
  const { data } = await getJson(
    `${BASE}/ayah/${number}/quran-uthmani`,
    signal,
  );
  return data;
}
