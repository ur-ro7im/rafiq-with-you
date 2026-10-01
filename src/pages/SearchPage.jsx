import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { fetchSurahs, searchQuran } from "../api/quran";
import { fetchNames } from "../api/names";
import { searchAdhkar } from "../api/search";
import { useAsync } from "../hooks/useAsync";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { normalizeArabic } from "../utils/text";
import SearchBar from "../components/ui/SearchBar";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";
import EmptyState from "../components/ui/EmptyState";

const LIMIT = 6;

function Block({ title, state, count, more, children }) {
  return (
    <section className="result-block">
      
      <div className="result-head">
        <h3>
          {title}
          {state.status === "ready" && (
            <small> ({count.toLocaleString("ar-EG")})</small>
          )}
        </h3>
        {more && count > LIMIT && <Link to={more}>كل النتائج</Link>}
      </div>
      {state.status === "loading" && (
        <div className="skeleton" style={{ height: 72 }} />
      )}
      {state.status === "error" && (
        <p className="hint">
          تعذّر تحميل هذا القسم.{" "}
          <button className="link-btn" onClick={state.retry}>
            إعادة المحاولة
          </button>
        </p>
      )}
      {state.status === "ready" && count === 0 && (
        <p className="hint">لا توجد نتائج.</p>
      )}
      {state.status === "ready" && count > 0 && (
        <div className="grid">{children}</div>
      )}
    </section>
  );
}

export default function SearchPage() {
  const { text, setText, query } = useSearchQuery();
  const enabled = query.length >= 2;
  const q = normalizeArabic(query);

  const quran = useAsync(
    (signal) => (enabled ? searchQuran(query, signal) : Promise.resolve(null)),
    [query],
  );
  const adhkar = useAsync(
    (signal) => (enabled ? searchAdhkar(query, signal) : Promise.resolve(null)),
    [query],
  );
  const surahsData = useAsync(fetchSurahs, []);
  const namesData = useAsync(fetchNames, []);

  const surahs = useMemo(
    () =>
      enabled && surahsData.data
        ? surahsData.data.filter(
            (s) =>
              String(s.number) === q ||
              normalizeArabic(s.name).includes(q) ||
              s.englishName.toLowerCase().includes(q),
          )
        : [],
    [enabled, surahsData.data, q],
  );
  const names = useMemo(
    () =>
      enabled && namesData.data
        ? namesData.data.filter(
            (n) =>
              normalizeArabic(n.name).includes(q) ||
              n.transliteration.toLowerCase().includes(q) ||
              n.meaning.toLowerCase().includes(q),
          )
        : [],
    [enabled, namesData.data, q],
  );

  return (
    <>
      <SectionHeader
        title="البحث"
        subtitle="في القرآن والسور والأذكار وأسماء الله"
      />
      <SearchBar
        value={text}
        onChange={setText}
        placeholder="ابحث عن آية أو سورة أو ذكر"
        autoFocus
      />

      {!enabled ? (
        <EmptyState
          icon={Search}
          title="ابدأ البحث"
          text="اكتب حرفين على الأقل."
        />
      ) : (
        <>
          <Block
            title="آيات"
            state={quran}
            count={quran.data?.count ?? 0}
            more={`/quran/search?q=${encodeURIComponent(query)}`}
          >
            {quran.data?.matches.slice(0, LIMIT).map((m) => (
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
          </Block>

          <Block title="سور" state={surahsData} count={surahs.length}>
            {surahs.slice(0, LIMIT).map((s) => (
              <IslamicCard
                as={Link}
                key={s.number}
                to={`/quran/${s.number}`}
                className="hit"
              >
                <strong>{s.name}</strong>
                <span className="hit-ref">{s.numberOfAyahs} آية</span>
              </IslamicCard>
            ))}
          </Block>

          <Block title="أذكار" state={adhkar} count={adhkar.data?.length ?? 0}>
            {adhkar.data?.slice(0, LIMIT).map((item) => (
              <IslamicCard
                as={Link}
                key={item.text}
                to={`/adhkar/${item.group.id}`}
                className="hit"
              >
                <p className="hit-text">
                  {item.text.length > 200
                    ? `${item.text.slice(0, 200)}…`
                    : item.text}
                </p>
                <span className="hit-ref">{item.group.title}</span>
              </IslamicCard>
            ))}
          </Block>

          <Block
            title="أسماء الله الحسنى"
            state={namesData}
            count={names.length}
          >
            {names.slice(0, LIMIT).map((n) => (
              <IslamicCard
                as={Link}
                key={n.number}
                to="/names-of-allah"
                className="hit"
              >
                <strong>{n.name}</strong>
                <span className="hit-ref" dir="ltr">
                  {n.transliteration} — {n.meaning}
                </span>
              </IslamicCard>
            ))}
          </Block>

          <p className="hint">
            للبحث في الأحاديث افتح <Link to="/hadith">الأحاديث</Link> واختر
            الكتاب، ثم ابحث داخله.
          </p>
        </>
      )}
    </>
  );
}
