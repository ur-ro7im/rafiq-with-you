import IslamicCard from "../ui/IslamicCard";
import ItemActions from "../ui/ItemActions";
import GradeList from "./GradeList";

export default function HadithCard({ hadith, collection, section }) {
  const number = hadith.arabicnumber ?? hadith.hadithnumber;
  const source = `${collection.name} — حديث رقم ${number}`;
  const item = {
    id: `hadith:${collection.id}:${hadith.hadithnumber}`,
    type: "hadith",
    text: hadith.text,
    ref: source,
    link: `/hadith/${collection.id}/${section}`,
  };

  return (
    <IslamicCard as="article" className="hadith">
      <p className="hadith-text">{hadith.text}</p>
      <div className="hadith-meta">
        <span>{source}</span>
        <GradeList grades={hadith.grades} />
      </div>
      <ItemActions item={item} shareText={`${hadith.text}\n\n— ${source}`} />
    </IslamicCard>
  );
}
