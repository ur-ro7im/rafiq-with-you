import { normalizeArabic } from "./text";

// نص الآية الأولى في كل سورة (عدا الفاتحة) يبدأ بالبسملة في هذا المصدر
export function stripBasmala(text, surahId, ayahNumber) {
  const hasPrefix = normalizeArabic(text).startsWith("بسم الله");
  if (surahId === 1 || ayahNumber !== 1 || !hasPrefix) return text;
  return text.split(" ").slice(4).join(" ");
}
