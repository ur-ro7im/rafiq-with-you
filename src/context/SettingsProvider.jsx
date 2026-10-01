import { useCallback, useEffect, useMemo } from "react";
import { SettingsContext } from "./settings-context";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { DEFAULT_SETTINGS } from "../constants/app";

export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage("settings", DEFAULT_SETTINGS);
  const update = useCallback(
    (patch) => setSettings((s) => ({ ...s, ...patch })),
    [setSettings],
  );
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), [setSettings]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark =
        settings.theme === "dark" ||
        (settings.theme === "system" && mq.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.lang = settings.lang;
    document.documentElement.dir = settings.lang === "ar" ? "rtl" : "ltr";
  }, [settings.lang]);

  const value = useMemo(
    () => ({ settings, update, reset }),
    [settings, update, reset],
  );
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
