export function to12h(str) {
  const [h, m] = str.slice(0, 5).split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "م" : "ص"}`;
}
export const pad = (n) => String(n).padStart(2, "0");
