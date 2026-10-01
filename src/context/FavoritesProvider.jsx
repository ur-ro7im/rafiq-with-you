import { useCallback, useMemo } from "react";
import { FavoritesContext } from "./favorites-context";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function FavoritesProvider({ children }) {
  const [items, setItems] = useLocalStorage("favorites", {});

  const toggle = useCallback(
    (item) =>
      setItems((prev) => {
        const next = { ...prev };
        if (next[item.id]) delete next[item.id];
        else next[item.id] = { ...item, savedAt: Date.now() };
        return next;
      }),
    [setItems],
  );

  const value = useMemo(
    () => ({
      has: (id) => Boolean(items[id]),
      toggle,
      list: Object.values(items).sort((a, b) => b.savedAt - a.savedAt),
    }),
    [items, toggle],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
