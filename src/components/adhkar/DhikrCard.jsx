import { Check, Hand } from "lucide-react";
import IslamicCard from "../ui/IslamicCard";
import ItemActions from "../ui/ItemActions";

export default function DhikrCard({ item, group, current, onTap, onFinish }) {
  const finished = current >= item.count;
  const favorite = {
    id: `dhikr:${group}:${item.id}`,
    type: "dhikr",
    text: item.text,
    ref: "حصن المسلم",
    link: `/adhkar/${group}`,
  };

  return (
    <IslamicCard as="article" className={`dhikr ${finished ? "is-done" : ""}`}>
      <p className="dhikr-text">{item.text}</p>
      {item.fadl && <p className="dhikr-note">{item.fadl}</p>}
      {item.source && <p className="dhikr-note">المصدر: {item.source}</p>}

      <div
        className="dhikr-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={item.count}
        aria-valuenow={Math.min(current, item.count)}
      >
        <span
          style={{ width: `${Math.min(100, (current / item.count) * 100)}%` }}
        />
      </div>

      <div className="dhikr-foot">
        <button
          className="btn btn-primary tap"
          onClick={onTap}
          disabled={finished}
        >
          {finished ? <Check size={20} /> : <Hand size={20} />}
          {finished ? "تم" : `${current} / ${item.count}`}
        </button>
        {!finished && item.count > 1 && (
          <button className="btn" onClick={onFinish}>
            تم
          </button>
        )}
        <ItemActions item={favorite} />
      </div>
    </IslamicCard>
  );
}
