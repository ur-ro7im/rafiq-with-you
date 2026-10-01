import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import SettingsProvider from "./context/SettingsProvider.jsx";
import PrayerTimesProvider from "./context/PrayerTimesProvider.jsx";
import FavoritesProvider from "./context/FavoritesProvider.jsx";
import { AzanProvider } from "./context/azan-context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <PrayerTimesProvider>
          <AzanProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </AzanProvider>
        </PrayerTimesProvider>
      </SettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);
