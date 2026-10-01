import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function HeroSearch() {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  return (
    <div className="hero-search">
      <SearchBar
        value={value}
        onChange={setValue}
        placeholder="ابحث في الآيات والأذكار وأسماء الله"
        onSubmit={(q) =>
          q.trim() && navigate(`/search?q=${encodeURIComponent(q.trim())}`)
        }
      />
    </div>
  );
}
