import {
  BedDouble,
  BookOpen,
  Landmark,
  Moon,
  Plane,
  Sparkles,
  Sun,
  Sunrise,
  Utensils,
} from "lucide-react";

// daily: يُقرأ من قاعدة أذكار الصباح والمساء، categories: عناوين الفئات في حصن المسلم
export const ADHKAR_GROUPS = [
  { id: "morning", title: "أذكار الصباح", icon: Sun, daily: "morning" },
  { id: "evening", title: "أذكار المساء", icon: Moon, daily: "evening" },
  {
    id: "after-prayer",
    title: "أذكار بعد الصلاة",
    icon: Landmark,
    categories: ["الأذكار بعد السلام من الصلاة"],
  },
  {
    id: "sleep",
    title: "أذكار النوم",
    icon: BedDouble,
    categories: ["أذكار النوم"],
  },
  {
    id: "waking",
    title: "أذكار الاستيقاظ",
    icon: Sunrise,
    categories: ["أذكار الاستيقاظ من النوم"],
  },
  {
    id: "travel",
    title: "أذكار السفر",
    icon: Plane,
    categories: ["دعاء الركوب", "دعاء السفر", "ذكر الرجوع من السفر"],
  },
  {
    id: "food",
    title: "أذكار الطعام",
    icon: Utensils,
    categories: ["الدعاء قبل الطعام", "الدعاء عند الفراغ من الطعام"],
  },
  {
    id: "general",
    title: "أذكار عامة",
    icon: BookOpen,
    categories: [
      "فضل التسبيح و التحميد، و التهليل، و التكبير",
      "الاستغفار و التوبة",
      "من أنواع الخير والآداب الجامعة",
    ],
  },
];

export const TASBEEH_PHRASES = [
  "سبحان الله",
  "الحمد لله",
  "الله أكبر",
  "لا إله إلا الله",
  "أستغفر الله",
];
