import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchSurah, fetchSurahs, fetchTafsir } from "../api/quran";
import { TAFSIRS } from "../constants/quran";
import { useAsync } from "../hooks/useAsync";
import { stripBasmala } from "../utils/quran";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";
import ItemActions from "../components/ui/ItemActions";
import ListSkeleton from "../components/ui/ListSkeleton";
import ErrorState from "../components/ui/ErrorState";

export default function TafsirPage() {
  const [params, setParams] = useSearchParams();
  const surahId = Math.min(114, Math.max(1, Number(params.get("s")) || 1));
  const source = TAFSIRS.find((t) => t.id === params.get("t")) ?? TAFSIRS[0];

  const surahs = useAsync(fetchSurahs, []);
  const verses = useAsync((signal) => fetchSurah(surahId, signal), [surahId]);
  const tafsir = useAsync(
    (signal) => fetchTafsir(surahId, source.id, signal),
    [surahId, source.id],
  );

  const total =
    surahs.data?.find((s) => s.number === surahId)?.numberOfAyahs ?? 1;
  const ayah = Math.min(total, Math.max(1, Number(params.get("a")) || 1));

  const update = (patch) =>
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(patch).forEach(([k, v]) => next.set(k, v));
        return next;
      },
      { replace: true },
    );

  const ready = verses.status === "ready" && tafsir.status === "ready";
  const failed = verses.status === "error" || tafsir.status === "error";
  const verse = verses.data?.ayahs[ayah - 1];
  const verseText = verse && stripBasmala(verse.text, surahId, ayah);
  const explanation = tafsir.data?.[ayah - 1];
  const reference = `${verses.data?.name} — آية ${ayah} — ${source.name}`;

  return (
    <>
      <SectionHeader
        title="تفسير القرآن"
        subtitle="اختر السورة والآية والمصدر"
      />

      <div className="picker">
        <label>
          السورة
          <select
            className="select"
            value={surahId}
            onChange={(e) => update({ s: e.target.value, a: 1 })}
          >
            {(surahs.data ?? []).map((s) => (
              <option key={s.number} value={s.number}>
                {s.number}. {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          الآية
          <select
            className="select"
            value={ayah}
            onChange={(e) => update({ a: e.target.value })}
          >
            {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="seg" role="group" aria-label="مصدر التفسير">
          {TAFSIRS.map((t) => (
            <button
              key={t.id}
              aria-pressed={t.id === source.id}
              onClick={() => update({ t: t.id })}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {!ready && !failed && <ListSkeleton count={2} height={140} />}
      {failed && (
        <ErrorState
          onRetry={() => {
            verses.retry();
            tafsir.retry();
          }}
        />
      )}

      {ready && (
        <IslamicCard as="article" className="tafsir">
          <p className="tafsir-verse">{verseText}</p>
          <h3>{source.name}</h3>
          <p className="tafsir-body">{explanation}</p>
          <ItemActions
            item={{
              id: `tafsir:${source.id}:${surahId}:${ayah}`,
              type: "tafsir",
              text: explanation,
              ref: reference,
              link: `/tafsir?s=${surahId}&a=${ayah}&t=${source.id}`,
            }}
            shareText={`﴿${verseText}﴾\n\n${explanation}\n\n— ${reference}`}
          />
        </IslamicCard>
      )}

      <nav className="pager" aria-label="التنقل بين الآيات">
        <button
          className="btn"
          disabled={ayah <= 1}
          onClick={() => update({ a: ayah - 1 })}
        >
          <ChevronRight size={18} /> الآية السابقة
        </button>
        <button
          className="btn"
          disabled={ayah >= total}
          onClick={() => update({ a: ayah + 1 })}
        >
          الآية التالية <ChevronLeft size={18} />
        </button>
      </nav>
    </>
  );
}
