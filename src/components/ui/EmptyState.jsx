import IslamicCard from "./IslamicCard";

export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <IslamicCard className="empty">
      {Icon && <Icon size={36} aria-hidden="true" />}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </IslamicCard>
  );
}
