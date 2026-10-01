import { Link } from "react-router-dom";
import { COLLECTIONS } from "../constants/hadith";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";

export default function HadithPage() {
  return (
    <>
      <SectionHeader
        title="الأحاديث"
        subtitle="الكتب الستة وموطأ مالك — البيانات من hadith-api المفتوح"
      />
      <div className="grid grid-list">
        {COLLECTIONS.map((c) => (
          <IslamicCard
            as={Link}
            to={`/hadith/${c.id}`}
            key={c.id}
            className="surah"
          >
            <span className="num">{c.books}</span>
            <div>
              <strong>{c.name}</strong>
              <div className="sub">
                {c.author} · {c.books} كتابًا
              </div>
            </div>
          </IslamicCard>
        ))}
      </div>
    </>
  );
}
