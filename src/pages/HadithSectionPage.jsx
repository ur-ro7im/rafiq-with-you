import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { fetchSection } from "../api/hadith";
import { COLLECTIONS } from "../constants/hadith";
import { useAsync } from "../hooks/useAsync";
import { normalizeArabic } from "../utils/text";
import HadithCard from "../components/hadith/HadithCard";
import SectionHeader from "../components/ui/SectionHeader";
import ListSkeleton from "../components/ui/ListSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

const PAGE = 20;

export default function HadithSectionPage() {
  const params = useParams();
  const collection = COLLECTIONS.find((c) => c.id === params.collection);
  const section = Number(params.section);
  const valid =
    collection &&
    Number.isInteger(section) &&
    section >= 1 &&
    section <= collection.books;

  const { status, data, retry } = useAsync(
    (signal) =>
      valid
        ? fetchSection(collection.edition, section, signal)
        : Promise.reject(new Error("bad route")),
    [params.collection, section],
  );
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    setQuery("");
    setShown(PAGE);
  }, [params.collection, section]);

  const hadiths = useMemo(() => {
    if (!data) return [];
    const q = normalizeArabic(query.trim());
    return q
      ? data.hadiths.filter((h) => normalizeArabic(h.text).includes(q))
      : data.hadiths;
  }, [data, query]);

  if (!valid) return <EmptyState title="الصفحة غير موجودة" />;

  const base = `/hadith/${collection.id}`;

  return (
    <>
      <SectionHeader
        title={collection.name}
        subtitle={
          data?.title ? `كتاب ${section} — ${data.title}` : `كتاب ${section}`
        }
      />

      {status === "loading" && <ListSkeleton count={4} height={150} />}
      {status === "error" && (
        <ErrorState
          onRetry={retry}
          text="تعذّر تحميل هذا الكتاب، أعد المحاولة أو اختر كتابًا آخر."
        />
      )}

      {status === "ready" && (
        <>
          <label className="search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={query}
              placeholder="ابحث في أحاديث هذا الكتاب"
              onChange={(e) => {
                setQuery(e.target.value);
                setShown(PAGE);
              }}
            />
          </label>

          {hadiths.length === 0 ? (
            <EmptyState icon={Search} title="لا توجد نتائج" />
          ) : (
            <div className="grid">
              {hadiths.slice(0, shown).map((h) => (
                <HadithCard
                  key={h.hadithnumber}
                  hadith={h}
                  collection={collection}
                  section={section}
                />
              ))}
            </div>
          )}

          {shown < hadiths.length && (
            <button
              className="btn more"
              onClick={() => setShown((n) => n + PAGE)}
            >
              عرض المزيد ({hadiths.length - shown})
            </button>
          )}
        </>
      )}

      <nav className="pager" aria-label="التنقل بين الكتب">
        {section > 1 ? (
          <Link className="btn" to={`${base}/${section - 1}`}>
            <ChevronRight size={18} /> الكتاب السابق
          </Link>
        ) : (
          <span />
        )}
        <Link className="btn" to={base}>
          كل الكتب
        </Link>
        {section < collection.books ? (
          <Link className="btn" to={`${base}/${section + 1}`}>
            الكتاب التالي <ChevronLeft size={18} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}
