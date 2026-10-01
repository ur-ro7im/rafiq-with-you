import { fetchAdhkarGroup } from "./adhkar";
import { ADHKAR_GROUPS } from "../constants/adhkar";
import { normalizeArabic } from "../utils/text";

export async function searchAdhkar(query, signal) {
  const q = normalizeArabic(query.trim());
  const groups = await Promise.all(
    ADHKAR_GROUPS.map(async (group) => ({
      group,
      items: (await fetchAdhkarGroup(group, signal)).flatMap((s) => s.items),
    })),
  );

  const seen = new Set();
  return groups.flatMap(({ group, items }) =>
    items
      .filter(
        (item) =>
          normalizeArabic(item.text).includes(q) &&
          !seen.has(item.text) &&
          seen.add(item.text),
      )
      .map((item) => ({ ...item, group })),
  );
}
