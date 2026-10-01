import { Link } from "react-router-dom";
import { Bookmark, Trash2 } from "lucide-react";
import { useFavorites } from "../context/favorites-context";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";
import EmptyState from "../components/ui/EmptyState";

const TYPES = {
  quran: "القرآن",
  hadith: "الأحاديث",
  dhikr: "الأذكار",
  tafsir: "التفسير",
};

export default function FavoritesPage({ type, title = "المفضلة" }) {
  const { list, toggle } = useFavorites();
  const items = type ? list.filter((i) => i.type === type) : list;

  return (
    <>
      <SectionHeader title={title} subtitle={`${items.length} عنصر محفوظ`} />
      {items.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="لا يوجد شيء هنا بعد"
          text="اضغط على أيقونة الحفظ في أي آية أو حديث لتجدها هنا."
        />
      ) : (
        <div className="grid">
          {items.map((item) => (
            <IslamicCard as="article" key={item.id} className="hadith">
              {!type && (
                <span className="tag">{TYPES[item.type] ?? item.type}</span>
              )}
              <p className="hadith-text">{item.text}</p>
              <div className="hadith-meta">
                <Link to={item.link}>{item.ref}</Link>
                <button
                  className="act"
                  aria-label="إزالة"
                  onClick={() => toggle(item)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </IslamicCard>
          ))}
        </div>
      )}
    </>
  );
}
