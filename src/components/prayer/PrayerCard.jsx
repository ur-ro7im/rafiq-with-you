import { memo } from "react";
import IslamicCard from "../ui/IslamicCard";
import { to12h } from "../../utils/time";

function PrayerCard({ prayer, time, isNext }) {
  return (
    <IslamicCard
      className={`prayer ${isNext ? "is-next" : ""}`}
      aria-current={isNext ? "true" : undefined}
    >
      <img src={prayer.img} alt="" loading="lazy" />
      <div className="body">
        <div className="n">{prayer.ar}</div>
        <div className="t">{to12h(time)}</div>
      </div>
    </IslamicCard>
  );
}

export default memo(PrayerCard);
