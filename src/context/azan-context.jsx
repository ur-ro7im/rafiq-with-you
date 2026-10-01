import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Volume2, VolumeX } from "lucide-react";
import { PRAYERS } from "../constants/app";
import { pad } from "../utils/time";
import { usePrayerData } from "./prayer-times-context";

const AzanContext = createContext(null);

const FILES = { default: "/audio/azan.mp3", Fajr: "/audio/azan-fajr.mp3" };
// ملف صامت قصير نشغّله مرة واحدة لفتح صلاحية الصوت دون تحميل ملفات الأذان
const SILENT =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

export function AzanProvider({ children }) {
  const { timings } = usePrayerData();
  const audioRef = useRef(null);
  const lastPlayed = useRef("");
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem("azanEnabled") === "true",
  );
  const [current, setCurrent] = useState(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setCurrent(null);
    }
    return audioRef.current;
  }, []);

  const unlock = useCallback(async () => {
    const audio = getAudio();
    audio.src = SILENT;
    try {
      await audio.play();
    } catch {
      // سيُطلب من المستخدم الضغط لاحقًا عند وقت الصلاة
    }
  }, [getAudio]);

  const playAzan = useCallback(
    (prayer) => {
      const audio = getAudio();
      audio.src = FILES[prayer.key] ?? FILES.default;
      setCurrent({ ar: prayer.ar, key: prayer.key, blocked: false });
      audio.play().catch(() => {
        setCurrent({ ar: prayer.ar, key: prayer.key, blocked: true });
      });
    },
    [getAudio],
  );

  const stopAzan = useCallback(() => {
    audioRef.current?.pause();
    setCurrent(null);
  }, []);

  const enableAzan = useCallback(async () => {
    await unlock();
    localStorage.setItem("azanEnabled", "true");
    setEnabled(true);
  }, [unlock]);

  const disableAzan = useCallback(() => {
    stopAzan();
    localStorage.setItem("azanEnabled", "false");
    setEnabled(false);
  }, [stopAzan]);

  const toggleAzan = useCallback(() => {
    if (enabled) disableAzan();
    else enableAzan();
  }, [enabled, enableAzan, disableAzan]);

  // بعد إعادة تحميل الصفحة المتصفح يطلب تفاعلًا جديدًا قبل تشغيل أي صوت
  useEffect(() => {
    if (!enabled || audioRef.current) return;
    const arm = () => unlock();
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
    };
  }, [enabled, unlock]);

  useEffect(() => {
    if (!enabled || !timings) return;

    const tick = () => {
      const now = new Date();
      const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const due = PRAYERS.find((p) => timings[p.key].slice(0, 5) === hhmm);
      if (!due) return;

      const stamp = `${due.key}-${now.toDateString()}`;
      if (lastPlayed.current === stamp) return;
      lastPlayed.current = stamp;
      playAzan(due);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [enabled, timings, playAzan]);

  const value = useMemo(
    () => ({
      azanEnabled: enabled,
      azanNotification: current?.ar ?? null,
      enableAzan,
      disableAzan,
      toggleAzan,
    }),
    [enabled, current, enableAzan, disableAzan, toggleAzan],
  );

  return (
    <AzanContext.Provider value={value}>
      {children}
      {current && (
        <div className="azan-toast" role="status">
          <Volume2 size={22} aria-hidden="true" />
          <span>حان الآن موعد أذان {current.ar}</span>
          {current.blocked ? (
            <button onClick={() => playAzan(current)}>تشغيل</button>
          ) : (
            <button onClick={stopAzan} aria-label="إيقاف الأذان">
              <VolumeX size={18} />
            </button>
          )}
        </div>
      )}
    </AzanContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAzan() {
  const context = useContext(AzanContext);
  if (!context) throw new Error("useAzan must be used inside AzanProvider");
  return context;
}
