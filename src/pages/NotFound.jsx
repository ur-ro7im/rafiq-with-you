import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <EmptyState
      icon={Compass}
      title="الصفحة غير موجودة"
      text="تأكد من الرابط أو عد إلى الصفحة الرئيسية."
      action={
        <Link className="btn btn-primary" to="/">
          الرئيسية
        </Link>
      }
    />
  );
}
