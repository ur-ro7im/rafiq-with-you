import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const day = 60 * 60 * 24;
const cacheable = { statuses: [0, 200] };

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["apple-touch-icon.png"],
      manifest: {
        name: "رفيق | Rafiq",
        short_name: "رفيق",
        description:
          "مواقيت الصلاة والقرآن والأحاديث والأذكار والقبلة في مكان واحد.",
        lang: "ar",
        dir: "rtl",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#f7f5ef",
        theme_color: "#0f6b57",
        icons: [
          { src: "/pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "/pwa-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/pwa-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // ملفات الأذان الصوتية كبيرة فلا تدخل في التخزين المسبق
        globPatterns: ["**/*.{js,css,html,png,jpeg,svg}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-css" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-files",
              cacheableResponse: cacheable,
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * day },
            },
          },
          {
            // نص القرآن والتفسير ثابت لا يتغير، فنقرأه من الجهاز بعد أول مرة
            urlPattern: ({ url }) =>
              url.origin === "https://api.alquran.cloud" &&
              !url.pathname.includes("/search/"),
            handler: "CacheFirst",
            options: {
              cacheName: "quran-data",
              cacheableResponse: cacheable,
              expiration: { maxEntries: 250, maxAgeSeconds: 180 * day },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/gh\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "hadith-adhkar-data",
              cacheableResponse: cacheable,
              expiration: { maxEntries: 250, maxAgeSeconds: 90 * day },
            },
          },
          {
            urlPattern: /^https:\/\/api\.aladhan\.com\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "aladhan",
              networkTimeoutSeconds: 4,
              cacheableResponse: cacheable,
              expiration: { maxEntries: 60, maxAgeSeconds: 7 * day },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
