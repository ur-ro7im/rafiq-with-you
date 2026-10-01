import { CloudOff, RefreshCw, Volume2, VolumeX } from "lucide-react";
import { CITIES, PRAYERS } from "../../constants/app";
import { useSettings } from "../../context/settings-context";
import { usePrayerData } from "../../context/prayer-times-context";
import { useAzan } from "../../context/azan-context";
import { useCountdown, useNextKey } from "../../hooks/useCountdown";
import { pad } from "../../utils/time";
import EmptyState from "../ui/EmptyState";
import PrayerCard from "./PrayerCard";
import CitySelect from "./CitySelect";

const gregorian = new Date().toLocaleDateString("ar-EG", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// العدّاد هو الجزء الوحيد الذي يتحدث كل ثانية
function NextPrayer({ timings, cityName }) {
  const countdown = useCountdown(timings);
  if (!countdown) return null;

  return (
    <div className="next" role="timer" aria-live="off">
      <div>
        <small>الصلاة القادمة · {cityName}</small>
        <span className="name">{countdown.prayer.ar}</span>
      </div>
      <div className="count">
        {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
      </div>
    </div>
  );
}

export default function PrayerWidget() {
  const { settings } = useSettings();
  const { status, timings, hijri, retry } = usePrayerData();
  const { azanEnabled, toggleAzan } = useAzan();
  const nextKey = useNextKey(timings);
  const cityName =
    CITIES.find((c) => c.api === settings.city)?.ar ?? settings.city;

  if (status === "error") {
    return (
      <EmptyState
        icon={CloudOff}
        title="تعذّر تحميل المواقيت"
        text="تحقق من الاتصال بالإنترنت ثم أعد المحاولة."
        action={
          <button className="btn btn-primary" onClick={retry}>
            <RefreshCw size={18} /> إعادة المحاولة
          </button>
        }
      />
    );
  }

  const loading = !timings;

  return (
    <section aria-label="مواقيت الصلاة">
      <div className="meta">
        <div>
          <strong>{gregorian}</strong>
          <div>
            {hijri
              ? `${hijri.weekday.ar}، ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ`
              : "…"}
          </div>
        </div>
        <CitySelect />
      </div>

      {loading ? (
        <>
          <div className="skeleton" style={{ height: 110 }} />
          <div className="prayer-row">
            {PRAYERS.map((p) => (
              <div key={p.key} className="skeleton" style={{ height: 150 }} />
            ))}
          </div>
        </>
      ) : (
        <>
          <NextPrayer timings={timings} cityName={cityName} />
          <button
            type="button"
            className={`btn btn-azan ${azanEnabled ? "is-on" : ""}`}
            aria-pressed={azanEnabled}
            onClick={toggleAzan}
          >
            {azanEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            {azanEnabled ? "الأذان مفعّل" : "تفعيل الأذان"}
          </button>
          <div className="prayer-row">
            {PRAYERS.map((p) => (
              <PrayerCard
                key={p.key}
                prayer={p}
                time={timings[p.key]}
                isNext={p.key === nextKey}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
