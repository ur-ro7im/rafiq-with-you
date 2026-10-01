import { useState } from "react";
import { Bookmark, Check, Copy, Share2 } from "lucide-react";
import { useFavorites } from "../../context/favorites-context";

export default function ItemActions({ item, shareText, children }) {
  const { has, toggle } = useFavorites();
  const [copied, setCopied] = useState(false);
  const saved = has(item.id);
  const text = shareText ?? item.text;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  }

  async function share() {
    if (!navigator.share) return copy();
    try {
      await navigator.share({ text });
    } catch {
      // user cancelled
    }
  }

  return (
    <div className="actions">
      {children}
      <button
        className="act"
        aria-pressed={saved}
        aria-label={saved ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        onClick={() => toggle(item)}
      >
        <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
      </button>
      <button className="act" aria-label="نسخ" onClick={copy}>
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
      <button className="act" aria-label="مشاركة" onClick={share}>
        <Share2 size={18} />
      </button>
    </div>
  );
}
