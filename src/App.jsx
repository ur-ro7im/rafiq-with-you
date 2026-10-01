import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";

const PrayerTimesPage = lazy(() => import("./pages/PrayerTimesPage.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));
const QuranPage = lazy(() => import("./pages/QuranPage.jsx"));
const SurahPage = lazy(() => import("./pages/SurahPage.jsx"));
const LastReadPage = lazy(() => import("./pages/LastReadPage.jsx"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage.jsx"));
const HadithPage = lazy(() => import("./pages/HadithPage.jsx"));
const HadithBooksPage = lazy(() => import("./pages/HadithBooksPage.jsx"));
const HadithSectionPage = lazy(() => import("./pages/HadithSectionPage.jsx"));
const AdhkarHubPage = lazy(() => import("./pages/AdhkarHubPage.jsx"));
const AdhkarGroupPage = lazy(() => import("./pages/AdhkarGroupPage.jsx"));
const TasbeehPage = lazy(() => import("./pages/TasbeehPage.jsx"));
const QiblaPage = lazy(() => import("./pages/QiblaPage.jsx"));
const TafsirPage = lazy(() => import("./pages/TafsirPage.jsx"));
const NamesPage = lazy(() => import("./pages/NamesPage.jsx"));
const HijriCalendarPage = lazy(() => import("./pages/HijriCalendarPage.jsx"));
const ZakatPage = lazy(() => import("./pages/ZakatPage.jsx"));
const PrayerSettingsPage = lazy(() => import("./pages/PrayerSettingsPage.jsx"));
const QuranSearchPage = lazy(() => import("./pages/QuranSearchPage.jsx"));
const SearchPage = lazy(() => import("./pages/SearchPage.jsx"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="skeleton" style={{ height: 120, margin: 24 }} />
      }
    >
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="prayer-times" element={<PrayerTimesPage />} />
          <Route path="quran" element={<QuranPage />} />
          <Route path="quran/last-read" element={<LastReadPage />} />
          <Route
            path="quran/favorites"
            element={<FavoritesPage type="quran" title="آيات محفوظة" />}
          />
          {/* <Route path="quran/search" element={<QuranSearchPage />} /> */}
          <Route path="quran/:id" element={<SurahPage />} />
          <Route path="hadith" element={<HadithPage />} />
          <Route
            path="hadith/favorites"
            element={<FavoritesPage type="hadith" title="الأحاديث المفضلة" />}
          />
          <Route path="hadith/:collection" element={<HadithBooksPage />} />
          <Route
            path="hadith/:collection/:section"
            element={<HadithSectionPage />}
          />
          <Route path="adhkar" element={<AdhkarHubPage />} />
          <Route path="adhkar/:group" element={<AdhkarGroupPage />} />
          <Route path="tasbeeh" element={<TasbeehPage />} />
          <Route path="qibla" element={<QiblaPage />} />
          <Route path="tafsir" element={<TafsirPage />} />
          <Route path="names-of-allah" element={<NamesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="hijri-calendar" element={<HijriCalendarPage />} />
          <Route path="zakat" element={<ZakatPage />} />
          <Route path="prayer-settings" element={<PrayerSettingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
