import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// النص يظهر فورًا في الحقل، أما البحث نفسه فيُحدَّث في الرابط بعد توقف الكتابة
export function useSearchQuery() {
  const [params, setParams] = useSearchParams();
  const urlValue = (params.get("q") ?? "").trim();
  console.log(urlValue)
  const [text, setText] = useState(urlValue);

  useEffect(() => {
    const id = setTimeout(() => {
      const next = text.trim();
      if (next !== urlValue)
        setParams(next ? { q: next } : {}, { replace: true });
    }, 400);
    return () => clearTimeout(id);
  }, [text, urlValue, setParams]);

  return { text, setText, query: urlValue };
}
