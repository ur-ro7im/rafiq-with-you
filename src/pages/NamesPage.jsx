import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { fetchNames } from "../api/names";
import { useAsync } from "../hooks/useAsync";
import { normalizeArabic } from "../utils/text";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";
import ListSkeleton from "../components/ui/ListSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function NamesPage() {
  const { status, data, retry } = useAsync(fetchNames, []);
  const [query, setQuery] = useState("");

  const names = useMemo(() => {
    if (!data) return [];
    const q = normalizeArabic(query.trim());
    if (!q) return data;
    return data.filter(
      (n) =>
        normalizeArabic(n.name).includes(q) ||
        n.transliteration.toLowerCase().includes(q) ||
        n.meaning.toLowerCase().includes(q),
    );
  }, [data, query]);

  return (
    <>
      <SectionHeader
        title="أسماء الله الحسنى"
        subtitle="الاسم والنطق والمعنى"
      />
      <label className="search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder="ابحث بالاسم أو المعنى"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {status === "loading" && <ListSkeleton count={9} height={120} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "ready" && names.length === 0 && (
        <EmptyState icon={Search} title="لا توجد نتائج" />
      )}
      {status === "ready" && names.length > 0 && (
        <div className="grid grid-names">
          {names.map((n) => (
            <IslamicCard key={n.number} className="name-card">
              <span className="num">{n.number}</span>
              <strong className="name-ar">{n.name}</strong>
              <span className="name-tr" dir="ltr">
                {n.transliteration}
              </span>
              <span className="name-en" dir="ltr">
                {n.meaning}
              </span>
            </IslamicCard>
          ))}
        </div>
      )}
    </>
  );
}
