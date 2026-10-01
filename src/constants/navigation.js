import {
  BookMarked,
  BookOpen,
  BookText,
  Bookmark,
  CalendarDays,
  Calculator,
  CircleDot,
  Clock3,
  Compass,
  Heart,
  Home,
  Moon,
  Scroll,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Sun,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    title: null,
    items: [
      { to: "/", label: "الرئيسية", icon: Home },
      { to: "/search", label: "البحث", icon: Search },
      { to: "/prayer-times", label: "مواقيت الصلاة", icon: Clock3 },
    ],
  },
  {
    title: "القرآن",
    items: [
      { to: "/quran", label: "القرآن الكريم", icon: BookOpen },
      { to: "/quran/last-read", label: "آخر قراءة", icon: BookMarked },
      { to: "/quran/favorites", label: "المفضلة", icon: Bookmark },
      // { to: "/quran/search", label: "البحث في القرآن", icon: Search },
    ],
  },
  {
    title: "السنة",
    items: [
      { to: "/hadith", label: "الأحاديث", icon: Scroll },
      { to: "/hadith/favorites", label: "الأحاديث المفضلة", icon: Heart },
    ],
  },
  {
    title: "المعرفة الإسلامية",
    items: [
      { to: "/tafsir", label: "تفسير القرآن", icon: BookText },
      { to: "/names-of-allah", label: "أسماء الله الحسنى", icon: Sparkles },
    ],
  },
  {
    title: "العبادة",
    items: [
      { to: "/adhkar", label: "الأذكار", icon: BookOpen },
      { to: "/adhkar/morning", label: "أذكار الصباح", icon: Sun },
      { to: "/adhkar/evening", label: "أذكار المساء", icon: Moon },
      { to: "/tasbeeh", label: "التسبيح", icon: CircleDot },
      { to: "/qibla", label: "اتجاه القبلة", icon: Compass },
    ],
  },
  {
    title: "أدوات",
    items: [
      { to: "/hijri-calendar", label: "التقويم الهجري", icon: CalendarDays },
      { to: "/zakat", label: "حاسبة الزكاة", icon: Calculator },
      {
        to: "/prayer-settings",
        label: "إعدادات مواقيت الصلاة",
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    title: "أخرى",
    items: [
      { to: "/favorites", label: "المفضلة", icon: Heart },
      { to: "/settings", label: "الإعدادات", icon: Settings },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

// اختصارات الصفحة الرئيسية
export const QUICK_ACCESS = [
  "/quran",
  "/hadith",
  "/adhkar",
  "/qibla",
  "/tafsir",
  "/prayer-times",
];
