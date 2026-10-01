# رفيق | Rafiq

منصة إسلامية تجمع مواقيت الصلاة والقرآن والأحاديث وغيرها. مبنية بـ React وVite.

## التشغيل

```bash
npm install
npm run dev
```

## مصادر البيانات

| القسم | المصدر |
| --- | --- |
| مواقيت الصلاة | [Aladhan API](https://aladhan.com/prayer-times-api) |
| القرآن والتلاوة | [Al-Quran Cloud](https://alquran.cloud/api) (تلاوة العفاسي) |
| الأحاديث | [hadith-api](https://github.com/fawazahmed0/hadith-api) عبر jsDelivr |
| التفسير | Al-Quran Cloud (الميسر والجلالين) |
| الأذكار | [Adhkar-json](https://github.com/rn0x/Adhkar-json) و[Morning-And-Evening-Adhkar-DB](https://github.com/Seen-Arabic/Morning-And-Evening-Adhkar-DB) |
| أسماء الله والتقويم الهجري | Aladhan API |
| القبلة والزكاة | حسابات محلية بلا مصدر خارجي |

لا توجد مفاتيح API مطلوبة. كل النصوص الدينية تُجلب من هذه المصادر ولا تُكتب داخل الكود.

## هيكل المشروع

```
src/
  api/          طلبات الشبكة لكل مصدر
  components/   ui / layout / prayer / hadith
  constants/    الإعدادات والتنقل
  context/      الإعدادات، المواقيت، الأذان، المفضلة
  hooks/
  pages/
  styles/
  utils/
```

## ملاحظات

- الأذان يعمل طالما الصفحة مفتوحة في المتصفح، ويحتاج تفعيلًا يدويًا مرة بعد كل إعادة تحميل.
- المفضلة وآخر قراءة وتفضيلات القارئ تُحفظ في `localStorage`.

## النسخة المحمولة (PWA)

التطبيق قابل للتثبيت على الموبايل من المتصفح (Android: «تثبيت»، iPhone: Safari ← مشاركة ← «إضافة إلى الشاشة الرئيسية»).
بعد أول زيارة تُحفظ الصفحات ونصوص القرآن والأحاديث والأذكار التي فُتحت، فتعمل بدون إنترنت.
تحتاج PWA إلى HTTPS عند النشر، وتُختبر عبر `npm run build && npm run preview` (لا تعمل في وضع `npm run dev`).

## تطبيق أندرويد / iOS (Capacitor)

الملف `capacitor.config.json` جاهز. غيّر `appId` أولًا ثم نفّذ:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npm run build
npx cap add android   # أو ios (يحتاج macOS وXcode)
npx cap sync
npx cap open android  # يفتح Android Studio لبناء ملف APK
```

الأذان وهو مغلق التطبيق يحتاج إشعارات محلية أصلية (`@capacitor/local-notifications`)، وهي غير مضافة بعد.
