import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Pause,
  Play,
  Plus,
} from "lucide-react";
import { ayahAudioUrl, fetchSurah } from "../api/quran";
import { useAsync } from "../hooks/useAsync";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { normalizeArabic } from "../utils/text";
import IslamicCard from "../components/ui/IslamicCard";
import ItemActions from "../components/ui/ItemActions";
import ListSkeleton from "../components/ui/ListSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

const SIZES = [1.4, 1.7, 2, 2.4, 2.9];
const FONTS = {
  quran: '"Amiri Quran", "Traditional Arabic", serif',
  plain: '"Tajawal", system-ui, sans-serif',
};

function loadQuranFont() {
  if (document.getElementById("quran-font")) return;
  const link = document.createElement("link");
  link.id = "quran-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Amiri+Quran&display=swap";
  document.head.appendChild(link);
}

export default function SurahPage() {
  const id = Number(useParams().id);
  const { hash } = useLocation();
  const valid = Number.isInteger(id) && id >= 1 && id <= 114;

  const { status, data, retry } = useAsync(
    (signal) =>
      valid ? fetchSurah(id, signal) : Promise.reject(new Error("bad id")),
    [id],
  );
  const [prefs, setPrefs] = useLocalStorage("reader", {
    size: 2,
    font: "quran",
  });
  const [, setLastRead] = useLocalStorage("lastRead", {});
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef(null);

  useEffect(loadQuranFont, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      setPlaying(null);
    };
  }, [id]);

  useEffect(() => {
    if (status === "ready" && hash) {
      document.querySelector(hash)?.scrollIntoView({ block: "center" });
    }
  }, [status, hash]);

  // آخر آية وصل لها القارئ = الآية التي تمر بمنتصف الشاشة
  useEffect(() => {
    if (!data) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) {
          setLastRead({
            surah: id,
            ayah: Number(hit.target.dataset.n),
            name: data.name,
          });
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll(".ayah").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data, id, setLastRead]);

  if (!valid) {
    return (
      <EmptyState title="السورة غير موجودة" text="اختر سورة من القائمة." />
    );
  }
  if (status === "loading") return <ListSkeleton count={6} height={110} />;
  if (status === "error") return <ErrorState onRetry={retry} />;

  const { ayahs } = data;
  const hasBasmala =
    id !== 1 &&
    id !== 9 &&
    normalizeArabic(ayahs[0].text).startsWith("بسم الله");
  const basmala = hasBasmala
    ? ayahs[0].text.split(" ").slice(0, 4).join(" ")
    : null;
  const ayahText = (a, i) =>
    hasBasmala && i === 0 ? a.text.split(" ").slice(4).join(" ") : a.text;

  function playFrom(index) {
    audioRef.current?.pause();
    if (index >= ayahs.length) return setPlaying(null);

    const audio = new Audio(ayahAudioUrl(ayahs[index].number));
    audio.onended = () => playFrom(index + 1);
    audio.onerror = () => setPlaying(null);
    audioRef.current = audio;
    setPlaying(index);
    audio.play().catch(() => setPlaying(null));
    document
      .getElementById(`ayah-${ayahs[index].numberInSurah}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function stop() {
    audioRef.current?.pause();
    setPlaying(null);
  }

  const setSize = (delta) =>
    setPrefs((p) => ({
      ...p,
      size: Math.min(SIZES.length - 1, Math.max(0, p.size + delta)),
    }));

  return (
    <>
      <IslamicCard as="header" className="reader-head">
        <h1>{data.name}</h1>
        <p>
          {data.revelationType === "Meccan" ? "مكية" : "مدنية"} ·{" "}
          {data.numberOfAyahs} آية
        </p>
        <div className="reader-tools">
          <button
            className="btn icon-btn"
            aria-label="تصغير الخط"
            onClick={() => setSize(-1)}
          >
            <Minus size={18} />
          </button>
          <button
            className="btn icon-btn"
            aria-label="تكبير الخط"
            onClick={() => setSize(1)}
          >
            <Plus size={18} />
          </button>
          <div className="seg" role="group" aria-label="نوع الخط">
            <button
              aria-pressed={prefs.font === "quran"}
              onClick={() => setPrefs((p) => ({ ...p, font: "quran" }))}
            >
              مصحف
            </button>
            <button
              aria-pressed={prefs.font === "plain"}
              onClick={() => setPrefs((p) => ({ ...p, font: "plain" }))}
            >
              عادي
            </button>
          </div>
          <button
            className="btn"
            onClick={playing === null ? () => playFrom(0) : stop}
          >
            {playing === null ? <Play size={18} /> : <Pause size={18} />}
            {playing === null ? "استماع" : "إيقاف"}
          </button>
        </div>
      </IslamicCard>

      {basmala && (
        <p className="basmala" style={{ fontFamily: FONTS[prefs.font] }}>
          {basmala}
        </p>
      )}

      <div
        className="mushaf"
        style={{
          fontSize: `${SIZES[prefs.size]}rem`,
          fontFamily: FONTS[prefs.font],
        }}
      >
        {ayahs.map((a, i) => {
          const text = ayahText(a, i);
          const n = a.numberInSurah;
          const item = {
            id: `quran:${id}:${n}`,
            type: "quran",
            text,
            ref: `${data.name} — آية ${n}`,
            link: `/quran/${id}#ayah-${n}`,
          };
          return (
            <article
              key={a.number}
              id={`ayah-${n}`}
              data-n={n}
              className={`ayah ${playing === i ? "is-playing" : ""}`}
            >
              <p className="ayah-text">
                {text}{" "}
                <span className="ayah-no">{n.toLocaleString("ar-EG")}</span>
              </p>
              <ItemActions item={item} shareText={`﴿${text}﴾\n\n— ${item.ref}`}>
                <button
                  className="act"
                  aria-label={playing === i ? "إيقاف" : "تشغيل الآية"}
                  onClick={() => (playing === i ? stop() : playFrom(i))}
                >
                  {playing === i ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </ItemActions>
            </article>
          );
        })}
      </div>

      <nav className="pager" aria-label="التنقل بين السور">
        {id > 1 ? (
          <Link className="btn" to={`/quran/${id - 1}`}>
            <ChevronRight size={18} /> السورة السابقة
          </Link>
        ) : (
          <span />
        )}
        {id < 114 && (
          <Link className="btn" to={`/quran/${id + 1}`}>
            السورة التالية <ChevronLeft size={18} />
          </Link>
        )}
      </nav>
    </>
  );
}
