// i18n setup: English + Bahasa Melayu, persisted to localStorage.
// First-time users default to English; the floating switcher writes the
// chosen language under STORAGE_KEY and i18next restores it on next load.
import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.js";
import ms from "./locales/ms.js";

export const STORAGE_KEY = "sp_lang";
export const SUPPORTED_LANGS = ["en", "ms"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ms: { translation: ms },
    },
    // First-time users (no stored choice) get English, per requirements —
    // so we do NOT fall back to the browser/navigator language here.
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGS,
    nonExplicitSupportedLngs: true, // treat "ms-MY" as "ms"
    detection: {
      // Only read/write our own localStorage key. Omitting "navigator" means an
      // untouched first visit lands on fallbackLng (en) rather than the OS locale.
      order: ["localStorage"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already escapes; we render some strings via <Trans>
    },
  });

export default i18n;
