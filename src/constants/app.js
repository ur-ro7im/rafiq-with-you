export const APP_NAME = "رفيق";
export const APP_NAME_AR = "رفيق";
export const DEFAULT_SETTINGS = {
  theme: "system",
  lang: "ar",
  city: "Cairo",
  method: 5,
  school: 0,
};
export const PRAYERS = [
  { key: "Fajr", ar: "الفجر", img: "/imgs/fajr.jpeg" },
  { key: "Dhuhr", ar: "الظهر", img: "/imgs/dohr.jpeg" },
  { key: "Asr", ar: "العصر", img: "/imgs/asr.jpeg" },
  { key: "Maghrib", ar: "المغرب", img: "/imgs/mgrb.jpeg" },
  { key: "Isha", ar: "العشاء", img: "/imgs/asha.jpeg" },
];
// طرق الحساب حسب معرّفات Aladhan API
export const METHODS = [
  { id: 5, ar: "الهيئة المصرية العامة للمساحة" },
  { id: 4, ar: "أم القرى (مكة المكرمة)" },
  { id: 3, ar: "رابطة العالم الإسلامي" },
  { id: 2, ar: "الجمعية الإسلامية لأمريكا الشمالية" },
  { id: 1, ar: "جامعة العلوم الإسلامية بكراتشي" },
];
export const CITIES = [
  ["Cairo", "القاهرة"],
  ["Giza", "الجيزة"],
  ["Alexandria", "الإسكندرية"],
  ["Dakahlia", "الدقهلية"],
  ["Red Sea", "البحر الأحمر"],
  ["Beheira", "البحيرة"],
  ["Fayoum", "الفيوم"],
  ["Gharbia", "الغربية"],
  ["Ismailia", "الإسماعيلية"],
  ["Monufia", "المنوفية"],
  ["Minya", "المنيا"],
  ["Qaliubiya", "القليوبية"],
  ["New Valley", "الوادي الجديد"],
  ["Suez", "السويس"],
  ["Aswan", "أسوان"],
  ["Assiut", "أسيوط"],
  ["Beni Suef", "بني سويف"],
  ["Port Said", "بورسعيد"],
  ["Damietta", "دمياط"],
  ["Sharkia", "الشرقية"],
  ["South Sinai", "جنوب سيناء"],
  ["Kafr el-Sheikh", "كفر الشيخ"],
  ["Matrouh", "مطروح"],
  ["Luxor", "الأقصر"],
  ["Qena", "قنا"],
  ["North Sinai", "شمال سيناء"],
  ["Sohag", "سوهاج"],
].map(([api, ar]) => ({ api, ar }));
