import { Outlet, useParams, useNavigate } from "react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const SUPPORTED = ["es", "en"] as const;
type Lang = (typeof SUPPORTED)[number];

export default function LangLayout() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!lang || !SUPPORTED.includes(lang as Lang)) {
      navigate("/es", { replace: true });
      return;
    }
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [lang, i18n, navigate]);

  return <Outlet />;
}
