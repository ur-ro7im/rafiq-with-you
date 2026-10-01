import { getJson } from "./http";

export async function fetchNames(signal) {
  const { data } = await getJson(
    "https://api.aladhan.com/v1/asmaAlHusna",
    signal,
  );
  return data.map((n) => ({
    number: n.number,
    name: n.name,
    transliteration: n.transliteration,
    meaning: n.en?.meaning ?? "",
  }));
}
