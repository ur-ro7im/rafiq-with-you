export default function ListSkeleton({ count = 6, height = 84 }) {
  return (
    <div className="grid grid-list">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}
