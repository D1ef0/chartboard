import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import es from "./locales/es.json";
import en from "./locales/en.json";

const initialLang =
  typeof window !== "undefined" &&
  window.location.pathname.split("/")[1] === "en"
    ? "en"
    : "es";

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: "es",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
