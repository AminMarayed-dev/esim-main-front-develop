import { RefreshCw, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../hooks/useLanguage";
import { Button } from "./button";

export function LanguageStatus() {
  const { t } = useTranslation();
  const {
    isManualSelection,
    clearLanguageOverride,
    geolocationData,
    currentLanguage,
    supportedLanguages,
  } = useLanguage();

  if (!isManualSelection) {
    return null; // Don't show anything for auto-detected languages
  }

  const currentLangInfo = supportedLanguages.find(
    (lang) => lang.code === currentLanguage
  );
  const countryName = geolocationData?.location?.country_name;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm text-blue-800 dark:text-blue-200">
            {t("language.manuallySet")} <strong>{currentLangInfo?.name}</strong>
            {countryName &&
              ` (${t("language.detectedLocation")}: ${countryName})`}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearLanguageOverride}
          className="text-blue-600 border-blue-300 hover:bg-blue-100 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-800/30"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          {t("language.autoDetect")}
        </Button>
      </div>
    </div>
  );
}
