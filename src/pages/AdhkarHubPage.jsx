import { Link } from "react-router-dom";
import { ADHKAR_GROUPS } from "../constants/adhkar";
import SectionHeader from "../components/ui/SectionHeader";
import IslamicCard from "../components/ui/IslamicCard";

export default function AdhkarHubPage() {
  return (
    <>
      <SectionHeader title="الأذكار" subtitle="من كتاب حصن المسلم" />
      <div className="grid grid-quick">
        {ADHKAR_GROUPS.map(({ id, title, icon: Icon }) => (
          <IslamicCard
            as={Link}
            to={`/adhkar/${id}`}
            key={id}
            className="quick"
          >
            <span className="ico">
              <Icon size={22} aria-hidden="true" />
            </span>
            <strong>{title}</strong>
          </IslamicCard>
        ))}
      </div>
    </>
  );
}
