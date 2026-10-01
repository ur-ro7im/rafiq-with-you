import { Link } from "react-router-dom";
import {
  loadAyahOfDay,
  loadDhikrOfDay,
  loadHadithOfDay,
} from "../../api/daily";
import { ADHKAR_GROUPS } from "../../constants/adhkar";
import { COLLECTIONS } from "../../constants/hadith";
import { useDaily } from "../../hooks/useDaily";
import GradeList from "../hadith/GradeList";
import IslamicCard from "../ui/IslamicCard";
import ItemActions from "../ui/ItemActions";

function DailyCard({ label, state, children }) {
  return (
    <IslamicCard as="article" className="daily">
      <span className="tag">{label}</span>
      {state.status === "loading" && (
        <div className="skeleton" style={{ height: 110 }} />
      )}
      {state.status === "error" && (
        <p className="hint">
          تعذّر التحميل.{" "}
          <button className="link-btn" onClick={state.retry}>
            إعادة المحاولة
          </button>
        </p>
      )}
      {state.status === "ready" && children}
    </IslamicCard>
  );
}

function AyahOfDay() {
  const state = useDaily("ayah", loadAyahOfDay);
  const a = state.data;
  const ref = a && `${a.surahName} — آية ${a.ayah}`;

  return (
    <DailyCard label="آية اليوم" state={state}>
      {a && (
        <>
          <p className="daily-ayah">{a.text}</p>
          <Link className="daily-ref" to={`/quran/${a.surah}#ayah-${a.ayah}`}>
            {ref}
          </Link>
          <ItemActions
            item={{
              id: `quran:${a.surah}:${a.ayah}`,
              type: "quran",
              text: a.text,
              ref,
              link: `/quran/${a.surah}#ayah-${a.ayah}`,
            }}
            shareText={`﴿${a.text}﴾\n\n— ${ref}`}
          />
        </>
      )}
    </DailyCard>
  );
}

function HadithOfDay() {
  const state = useDaily("hadith", loadHadithOfDay);
  const d = state.data;
  const collection = d && COLLECTIONS.find((c) => c.id === d.collectionId);
  const source =
    d &&
    collection &&
    `${collection.name} — حديث رقم ${d.hadith.arabicnumber ?? d.hadith.hadithnumber}`;

  return (
    <DailyCard label="حديث اليوم" state={state}>
      {d && collection && (
        <>
          <p className="daily-text">{d.hadith.text}</p>
          <Link
            className="daily-ref"
            to={`/hadith/${d.collectionId}/${d.section}`}
          >
            {source}
          </Link>
          <GradeList grades={d.hadith.grades} />
          <ItemActions
            item={{
              id: `hadith:${d.collectionId}:${d.hadith.hadithnumber}`,
              type: "hadith",
              text: d.hadith.text,
              ref: source,
              link: `/hadith/${d.collectionId}/${d.section}`,
            }}
            shareText={`${d.hadith.text}\n\n— ${source}`}
          />
        </>
      )}
    </DailyCard>
  );
}

function DhikrOfDay() {
  const state = useDaily("dhikr", loadDhikrOfDay);
  const d = state.data;
  const group = d && ADHKAR_GROUPS.find((g) => g.id === d.groupId);

  return (
    <DailyCard label="ذكر اليوم" state={state}>
      {d && group && (
        <>
          <p className="daily-text">{d.text}</p>
          {d.count > 1 && (
            <span className="hint">
              يُقال {d.count.toLocaleString("ar-EG")} مرات
            </span>
          )}
          {d.source && <span className="hint">المصدر: {d.source}</span>}
          <Link className="daily-ref" to={`/adhkar/${group.id}`}>
            {group.title}
          </Link>
          <ItemActions
            item={{
              id: `dhikr:${group.id}:${d.id}`,
              type: "dhikr",
              text: d.text,
              ref: group.title,
              link: `/adhkar/${group.id}`,
            }}
          />
        </>
      )}
    </DailyCard>
  );
}

export default function DailyContent() {
  return (
    <div className="grid grid-daily">
      <AyahOfDay />
      <HadithOfDay />
      <DhikrOfDay />
    </div>
  );
}
