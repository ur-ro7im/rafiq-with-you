import { getJson } from "./http";

const BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

export async function fetchSection(edition, number, signal) {
  const path = `${BASE}/${edition}/sections/${number}`;
  let data;
  try {
    data = await getJson(`${path}.min.json`, signal);
  } catch (err) {
    if (err.name === "AbortError") throw err;
    data = await getJson(`${path}.json`, signal);
  }
  const title = Object.values(data.metadata.section)[0] ?? "";
  return { title, hadiths: data.hadiths };
}
