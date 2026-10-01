import { RotateCcw } from "lucide-react";
import { TASBEEH_PHRASES } from "../constants/adhkar";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";

const TARGETS = [33, 100, 0];

export default function TasbeehPage() {
  const [state, setState] = useLocalStorage("tasbeeh", {
    phrase: TASBEEH_PHRASES[0],
    count: 0,
    target: 33,
  });
  const reached = state.target > 0 && state.count >= state.target;

  function tap() {
    const count = state.count + 1;
    setState((s) => ({ ...s, count }));
    navigator.vibrate?.(
      state.target > 0 && count % state.target === 0 ? [40, 40, 40] : 12,
    );
  }

  return (
    <>
      <SectionHeader
        title="التسبيح"
        subtitle="اختر الذكر وعدّاد الهدف ثم اضغط للعد"
      />
      <IslamicCard className="tasbeeh">
        <div className="seg" role="group" aria-label="الذكر">
          {TASBEEH_PHRASES.map((phrase) => (
            <button
              key={phrase}
              aria-pressed={state.phrase === phrase}
              onClick={() => setState((s) => ({ ...s, phrase }))}
            >
              {phrase}
            </button>
          ))}
        </div>

        <button
          className={`tasbeeh-btn ${reached ? "is-done" : ""}`}
          onClick={tap}
          aria-label={`${state.phrase}، العدد ${state.count}`}
        >
          <span className="tasbeeh-phrase">{state.phrase}</span>
          <span className="tasbeeh-count">{state.count}</span>
          {state.target > 0 && (
            <span className="tasbeeh-target">من {state.target}</span>
          )}
        </button>

        <div className="tasbeeh-foot">
          <div className="seg" role="group" aria-label="الهدف">
            {TARGETS.map((target) => (
              <button
                key={target}
                aria-pressed={state.target === target}
                onClick={() => setState((s) => ({ ...s, target }))}
              >
                {target === 0 ? "مفتوح" : target}
              </button>
            ))}
          </div>
          <button
            className="btn"
            onClick={() => setState((s) => ({ ...s, count: 0 }))}
          >
            <RotateCcw size={18} /> تصفير
          </button>
        </div>
      </IslamicCard>
    </>
  );
}
