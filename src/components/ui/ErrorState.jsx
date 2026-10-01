import { CloudOff, RefreshCw } from "lucide-react";
import EmptyState from "./EmptyState";

export default function ErrorState({ onRetry, text }) {
  return (
    <EmptyState
      icon={CloudOff}
      title="تعذّر تحميل البيانات"
      text={text ?? "تحقق من الاتصال بالإنترنت ثم أعد المحاولة."}
      action={
        <button className="btn btn-primary" onClick={onRetry}>
          <RefreshCw size={18} />
          إعادة المحاولة
        </button>
      }
    />
  );
}
