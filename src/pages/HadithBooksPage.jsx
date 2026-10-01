import { Link, useParams } from "react-router-dom";
import { COLLECTIONS } from "../constants/hadith";
import SectionHeader from "../components/ui/SectionHeader";
import EmptyState from "../components/ui/EmptyState";

export default function HadithBooksPage() {
  const { collection: id } = useParams();
  const collection = COLLECTIONS.find((c) => c.id === id);
  if (!collection) return <EmptyState title="المجموعة غير موجودة" />;

  return (
    <>
      <SectionHeader title={collection.name} subtitle="اختر رقم الكتاب" />
      <div className="grid grid-quick">
        {Array.from({ length: collection.books }, (_, i) => i + 1).map((n) => (
          <Link
            key={n}
            to={`/hadith/${collection.id}/${n}`}
            className="btn book"
          >
            كتاب {n}
          </Link>
        ))}
      </div>
    </>
  );
}
