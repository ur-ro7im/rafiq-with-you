import { useParams } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { fetchAdhkarGroup } from "../api/adhkar";
import { ADHKAR_GROUPS } from "../constants/adhkar";
import { useAsync } from "../hooks/useAsync";
import { useDhikrProgress } from "../hooks/useDhikrProgress";
import DhikrCard from "../components/adhkar/DhikrCard";
import SectionHeader from "../components/ui/SectionHeader";
import ListSkeleton from "../components/ui/ListSkeleton";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function AdhkarGroupPage() {
  const { group: groupId } = useParams();
  const group = ADHKAR_GROUPS.find((g) => g.id === groupId);
  const { counts, tap, finish, reset } = useDhikrProgress();

  const { status, data, retry } = useAsync(
    (signal) =>
      group
        ? fetchAdhkarGroup(group, signal)
        : Promise.reject(new Error("unknown group")),
    [groupId],
  );

  if (!group) return <EmptyState title="القسم غير موجود" />;

  const items = data?.flatMap((section) => section.items) ?? [];
  const progressId = (item) => `${groupId}:${item.id}`;
  const done = items.filter(
    (item) => (counts[progressId(item)] ?? 0) >= item.count,
  ).length;

  return (
    <>
      <SectionHeader
        title={group.title}
        subtitle={
          status === "ready" ? `أنجزت ${done} من ${items.length}` : undefined
        }
      />

      {status === "loading" && <ListSkeleton count={4} height={160} />}
      {status === "error" && <ErrorState onRetry={retry} />}
      {status === "ready" && items.length === 0 && (
        <EmptyState
          title="لا توجد أذكار"
          text="لم نجد هذا القسم في مصدر البيانات."
        />
      )}

      {status === "ready" && items.length > 0 && (
        <>
          <button
            className="btn reset"
            onClick={() => reset(items.map(progressId))}
          >
            <RotateCcw size={18} /> إعادة العدّ
          </button>
          {data.map((section, i) => (
            <div key={i} className="grid">
              {data.length > 1 && section.title && (
                <h3 className="subhead">{section.title}</h3>
              )}
              {section.items.map((item) => (
                <DhikrCard
                  key={item.id}
                  item={item}
                  group={groupId}
                  current={counts[progressId(item)] ?? 0}
                  onTap={() => {
                    navigator.vibrate?.(15);
                    tap(progressId(item), item.count);
                  }}
                  onFinish={() => finish(progressId(item), item.count)}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </>
  );
}
