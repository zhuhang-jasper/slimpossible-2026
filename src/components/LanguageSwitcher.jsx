import { useTranslation } from "react-i18next";

import { ChevronDown } from "lucide-react";

import { track } from "../utils/analytics.js";

// Language dropdown (EN / BM) sitting in the hero. A native <select> keeps it
// accessible and avoids custom popover logic; the chosen language is persisted by
// i18next's languageDetector localStorage cache.
function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  // i18n.language can be a region tag (e.g. "en-US"); normalise to the base.
  const [current] = (i18n.resolvedLanguage || i18n.language || "en").split("-");

  const onChange = (event) => {
    const lng = event.target.value;
    if (lng === current) {
      return;
    }
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    track("switch_language", { lang: lng });
  };

  return (
    <div className="lang-switch">
      <select className="lang-select" value={current} onChange={onChange} aria-label={t("lang.switchLabel")}>
        <option value="en">{t("lang.en")}</option>
        <option value="ms">{t("lang.ms")}</option>
      </select>
      <ChevronDown className="lang-caret" size={16} strokeWidth={2.75} aria-hidden="true" />
    </div>
  );
}

export default LanguageSwitcher;
