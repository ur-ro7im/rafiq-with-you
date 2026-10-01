import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookMarked, Search } from "lucide-react";
import { fetchSurahs } from "../api/quran";
import { useAsync } from "../hooks/useAsync";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { normalizeArabic } from "../utils/text";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";
import ListSkeleton from "../components/ui/ListSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function QuranPage() {
  const { status, data, retry } = useAsync(fetchSurahs, []);
  const [query, setQuery] = useState("");
  const [lastRead] = useLocalStorage("lastRead", {});

  const surahs = useMemo(() => {
    if (!data) return [];
    const q = normalizeArabic(query.trim());
    if (!q) return data;
    return data.filter(
      (s) =>
        String(s.number) === q ||
        normalizeArabic(s.name).includes(q) ||
        s.englishName.toLowerCase().includes(q),
    );
  }, [data, query]);

  return (
    <>
      <SectionHeader title="القرآن الكريم" subtitle="١١٤ سورة" />

      {lastRead.surah && (
        <IslamicCard
          as={Link}
          to={`/quran/${lastRead.surah}#ayah-${lastRead.ayah}`}
          className="continue"
        >
          <BookMarked size={22} aria-hidden="true" />
          <div>
            <strong>تابع القراءة</strong>
            <div>
              {lastRead.name} — آية {lastRead.ayah}
            </div>
          </div>
        </IslamicCard>
      )}

      <label className="search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder="ابحث باسم السورة أو رقمها"
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {status === "loading" && <ListSkeleton count={12} height={76} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "ready" && surahs.length === 0 && (
        <EmptyState
          icon={Search}
          title="لا توجد نتائج"
          text="جرّب كلمة أخرى."
        />
      )}
      {status === "ready" && surahs.length > 0 && (
        <div className="grid grid-list">
          {surahs.map((s) => (
            <IslamicCard
              as={Link}
              to={`/quran/${s.number}`}
              key={s.number}
              className="surah"
            >
              <span className="num">{s.number}</span>
              <div>
                <strong>{s.name}</strong>
                <div className="sub">
                  {s.revelationType === "Meccan" ? "مكية" : "مدنية"} ·{" "}
                  {s.numberOfAyahs} آية
                </div>
              </div>
            </IslamicCard>
          ))}
        </div>
      )}
    </>
  );
}
