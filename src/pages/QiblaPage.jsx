import { useState } from "react";
import { Compass as CompassIcon, LocateFixed } from "lucide-react";
import { CITIES } from "../constants/app";
import { useSettings } from "../context/settings-context";
import { usePrayerData } from "../context/prayer-times-context";
import { useCompass } from "../hooks/useCompass";
import { directionName, distanceToKaabaKm, qiblaBearing } from "../utils/geo";
import Compass from "../components/qibla/Compass";
import CitySelect from "../components/prayer/CitySelect";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";

export default function QiblaPage() {
  const { settings } = useSettings();
  const { meta } = usePrayerData();
  const { heading, active, start } = useCompass();
  const [position, setPosition] = useState(null);
  const [denied, setDenied] = useState(false);

  const city = CITIES.find((c) => c.api === settings.city)?.ar ?? settings.city;
  const point =
    position ??
    (meta && { lat: Number(meta.latitude), lng: Number(meta.longitude) });
  const bearing = point ? qiblaBearing(point.lat, point.lng) : null;

  function locate() {
    navigator.geolocation?.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setDenied(false);
      },
      () => setDenied(true),
    );
  }

  return (
    <>
      <SectionHeader
        title="اتجاه القبلة"
        subtitle="يُحسب من موقعك أو من المدينة المختارة"
      />

      {bearing === null ? (
        <div className="skeleton" style={{ height: 320 }} />
      ) : (
        <IslamicCard className="qibla">
          <Compass bearing={bearing} heading={heading} />
          <div className="qibla-info">
            <strong>
              {Math.round(bearing)}° — {directionName(bearing)}
            </strong>
            <span>
              المسافة إلى مكة المكرمة:{" "}
              {Math.round(
                distanceToKaabaKm(point.lat, point.lng),
              ).toLocaleString("ar-EG")}{" "}
              كم
            </span>
            <span>{position ? "حسب موقعك الحالي" : `حسب مدينة ${city}`}</span>
          </div>
        </IslamicCard>
      )}

      <div className="qibla-actions">
        <CitySelect />
        <button className="btn" onClick={locate}>
          <LocateFixed size={18} /> استخدم موقعي
        </button>
        <button className="btn" onClick={start} disabled={active}>
          <CompassIcon size={18} /> {active ? "البوصلة تعمل" : "تشغيل البوصلة"}
        </button>
      </div>

      {denied && (
        <p className="hint">
          تعذّر الوصول إلى موقعك. يمكنك تفعيل صلاحية الموقع من إعدادات المتصفح،
          أو اختيار مدينتك يدويًا.
        </p>
      )}
      {active && heading === null && (
        <p className="hint">
          لم يصل قراءة من البوصلة بعد. حرّك الجهاز قليلًا، وقد لا تتوفر البوصلة
          على الحاسوب.
        </p>
      )}
      <p className="hint">
        الإبرة تشير إلى القبلة. عند تشغيل البوصلة، وجّه أعلى الجهاز نحو الإبرة
        حتى تصبح للأعلى.
      </p>
    </>
  );
}
