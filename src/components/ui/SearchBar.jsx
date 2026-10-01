import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "ابحث…",
  autoFocus = false,
}) {
  return (
    <form
      role="search"
      className="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <Search size={18} aria-hidden="true" />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </form>
  );
}
