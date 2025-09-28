import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation files
import en from "./locales/en.json";
import fa from "./locales/fa.json";
import ar from "./locales/ar.json";
import tr from "./locales/tr.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import es from "./locales/es.json";
import ru from "./locales/ru.json";

const resources = {
  en: { translation: en },
  fa: { translation: fa },
  ar: { translation: ar },
  tr: { translation: tr },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  ru: { translation: ru },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    detection: {
      order: ["localStorage", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
