import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { searchQuran } from "../api/quran";
import { useAsync } from "../hooks/useAsync";
import { useSearchQuery } from "../hooks/useSearchQuery";
import SearchBar from "../components/ui/SearchBar";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";
import ListSkeleton from "../components/ui/ListSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

const PAGE = 30;

export default function QuranSearchPage() {
  const { text, setText, query } = useSearchQuery();
  const [shown, setShown] = useState(PAGE);
  const enabled = query.length >= 2;

  const { status, data, retry } = useAsync(
    (signal) => (enabled ? searchQuran(query, signal) : Promise.resolve(null)),
    [query],
  );
// 
  useEffect(() => setShown(PAGE), [query]);
// useEffect(() => {
//   console.log(status);
// })
  return (
    <>
      <SectionHeader
        title="البحث في القرآن"
        subtitle="اكتب كلمة أو جزءًا من آية"
      />
      <SearchBar
        value={text}
        onChange={setText}
        placeholder="ابحث في آيات القرآن"
        autoFocus
      />

      {!enabled && (
        <EmptyState
          icon={Search}
          title="ابدأ البحث"
          text="اكتب حرفين على الأقل."
        />
      )}
      {enabled && status === "loading" && (
        <ListSkeleton count={4} height={110} />
      )}
      {enabled && status === "error" && <ErrorState onRetry={retry} />}
      {enabled && status === "ready" && data.count === 0 && (
        <EmptyState
          icon={Search}
          title="لا توجد نتائج"
          text="جرّب كلمة أخرى."
        />
      )}

      {enabled && status === "ready" && data.count > 0 && (
        <>
          <p className="hint">{data.count.toLocaleString("ar-EG")} نتيجة</p>
          <div className="grid">
            {data.matches.slice(0, shown).map((m) => (
              <IslamicCard
                as={Link}
                key={m.number}
                to={`/quran/${m.surah.number}#ayah-${m.numberInSurah}`}
                className="hit"
              >
                <p className="hit-text">{m.text}</p>
                <span className="hit-ref">
                  {m.surah.name} — آية {m.numberInSurah}
                </span>
              </IslamicCard>
            ))}
          </div>
          {shown < data.matches.length && (
            <button
              className="btn more"
              onClick={() => setShown((n) => n + PAGE)}
            >
              عرض المزيد
            </button>
          )}
        </>
      )}
    </>
  );
}
