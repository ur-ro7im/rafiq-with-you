import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchHijriMonth } from "../api/aladhan";
import { useAsync } from "../hooks/useAsync";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";
import ListSkeleton from "../components/ui/ListSkeleton";
import ErrorState from "../components/ui/ErrorState";

const WEEKDAYS = [
  "السبت",
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
];
const arNumber = (n) => Number(n).toLocaleString("ar-EG");

export default function HijriCalendarPage() {
  const today = new Date();
  const [view, setView] = useState({
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });
  const { status, data, retry } = useAsync(
    () => fetchHijriMonth(view.month, view.year),
    [view.month, view.year],
  );

  const monthStart = new Date(view.year, view.month - 1, 1);
  const offset = (monthStart.getDay() + 1) % 7; // الأسبوع يبدأ من السبت
  const isCurrentMonth =
    view.month === today.getMonth() + 1 && view.year === today.getFullYear();

  function shift(delta) {
    const next = new Date(view.year, view.month - 1 + delta, 1);
    setView({ month: next.getMonth() + 1, year: next.getFullYear() });
  }

  const first = data?.[0]?.hijri;
  const last = data?.[data.length - 1]?.hijri;
  const hijriRange =
    first &&
    (first.month.number === last.month.number
      ? `${first.month.ar} ${first.year}`
      : `${first.month.ar} ${first.year} – ${last.month.ar} ${last.year}`);
  const occasions = data?.filter((d) => d.hijri.holidays?.length) ?? [];

  return (
    <>
      <SectionHeader
        title="التقويم الهجري"
        subtitle="الميلادي والهجري جنبًا إلى جنب"
      />

      <div className="cal-head">
        <button
          className="btn icon-btn"
          aria-label="الشهر السابق"
          onClick={() => shift(-1)}
        >
          <ChevronRight size={20} />
        </button>
        <div className="cal-title">
          <strong>
            {monthStart.toLocaleDateString("ar-EG", {
              month: "long",
              year: "numeric",
            })}
          </strong>
          {hijriRange && <span>{hijriRange} هـ</span>}
        </div>
        <button
          className="btn icon-btn"
          aria-label="الشهر التالي"
          onClick={() => shift(1)}
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      {!isCurrentMonth && (
        <button
          className="btn cal-today"
          onClick={() =>
            setView({ month: today.getMonth() + 1, year: today.getFullYear() })
          }
        >
          العودة لهذا الشهر
        </button>
      )}

      {status === "loading" && <ListSkeleton count={1} height={360} />}
      {status === "error" && <ErrorState onRetry={retry} />}

      {status === "ready" && (
        <>
          <IslamicCard className="cal">
            <div className="cal-grid" role="grid">
              {WEEKDAYS.map((d) => (
                <div key={d} className="cal-weekday" role="columnheader">
                  {d}
                </div>
              ))}
              {Array.from({ length: offset }, (_, i) => (
                <div key={`blank-${i}`} />
              ))}
              {data.map((d) => {
                const day = Number(d.gregorian.day);
                const isToday = isCurrentMonth && day === today.getDate();
                return (
                  <div
                    key={day}
                    role="gridcell"
                    className={`cal-day ${isToday ? "is-today" : ""}`}
                    aria-current={isToday ? "date" : undefined}
                  >
                    <span className="g">{arNumber(day)}</span>
                    <span className="h">{arNumber(d.hijri.day)}</span>
                    {d.hijri.holidays?.length > 0 && (
                      <i className="dot" aria-label="مناسبة" />
                    )}
                  </div>
                );
              })}
            </div>
          </IslamicCard>

          {occasions.length > 0 && (
            <>
              <SectionHeader title="المناسبات هذا الشهر" />
              <div className="grid">
                {occasions.map((d) => (
                  <IslamicCard key={d.gregorian.date} className="occasion">
                    <strong>
                      {arNumber(d.hijri.day)} {d.hijri.month.ar} —{" "}
                      {arNumber(d.gregorian.day)}{" "}
                      {monthStart.toLocaleDateString("ar-EG", {
                        month: "long",
                      })}
                    </strong>
                    <span dir="ltr">{d.hijri.holidays.join("، ")}</span>
                  </IslamicCard>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
