import { Navigate } from "react-router-dom";
import { BookMarked } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import EmptyState from "../components/ui/EmptyState";

export default function LastReadPage() {
  const [lastRead] = useLocalStorage("lastRead", {});

  if (!lastRead.surah) {
    return (
      <EmptyState
        icon={BookMarked}
        title="لا توجد قراءة سابقة"
        text="ابدأ بقراءة أي سورة وسيُحفظ موضعك تلقائيًا."
      />
    );
  }
  return (
    <Navigate to={`/quran/${lastRead.surah}#ayah-${lastRead.ayah}`} replace />
  );
}
