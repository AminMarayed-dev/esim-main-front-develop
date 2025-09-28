import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  detectUserLanguage,
  getUserGeolocation,
  type GeolocationResponse,
} from "../services/geolocation";
import { supportedLanguages } from "../constants/languages";
import { LanguageContext, type LanguageContextType } from "./LanguageContext";

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguageState] = useState<string>("en");
  const [geolocationData, setGeolocationData] =
    useState<GeolocationResponse | null>(null);
  const [isLanguageLoading, setIsLanguageLoading] = useState(true);
  const [isManualSelection, setIsManualSelection] = useState(false);

  const setCurrentLanguage = useCallback(
    (language: string, isManualSelection = false) => {
      setCurrentLanguageState(language);
      setIsManualSelection(isManualSelection);
      i18n.changeLanguage(language);
      localStorage.setItem("user-language", language);
      // Track if this was a manual selection vs auto-detection
      localStorage.setItem(
        "language-selection-type",
        isManualSelection ? "manual" : "auto"
      );
    },
    [i18n]
  );

  const clearLanguageOverride = useCallback(() => {
    localStorage.removeItem("language-selection-type");
    setIsManualSelection(false);
    // Re-detect language based on current IP
    detectUserLanguage().then((detectedLanguage) => {
      setCurrentLanguage(detectedLanguage, false);
    });
  }, [setCurrentLanguage]);

  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        setIsLanguageLoading(true);

        // Get geolocation data first (always check current IP)
        const geoData = await getUserGeolocation();
        setGeolocationData(geoData);

        // Detect current language based on current IP
        const detectedLanguage = await detectUserLanguage();
        console.log("Detected language from current IP:", detectedLanguage);

        // Check if user has manually selected a language before
        const savedLanguage = localStorage.getItem("user-language");
        const selectionType = localStorage.getItem("language-selection-type");

        let languageToUse: string;

        if (
          savedLanguage &&
          selectionType === "manual" &&
          supportedLanguages.some((lang) => lang.code === savedLanguage)
        ) {
          // Use manually selected language (user override)
          languageToUse = savedLanguage;
          setIsManualSelection(true);
          console.log("Using manually selected language:", savedLanguage);
        } else {
          // Always use current IP detection for auto-detected languages
          languageToUse = detectedLanguage;
          setIsManualSelection(false);
          console.log("Using current IP detected language:", detectedLanguage);
        }

        setCurrentLanguage(languageToUse, selectionType === "manual");
      } catch (error) {
        console.error("Error initializing language:", error);
        // Fallback to English
        setCurrentLanguage("en");
      } finally {
        setIsLanguageLoading(false);
      }
    };

    initializeLanguage();
  }, [setCurrentLanguage]);

  // Update document direction based on language
  useEffect(() => {
    const isRTL = currentLanguage === "fa" || currentLanguage === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const value: LanguageContextType = {
    currentLanguage,
    setCurrentLanguage,
    geolocationData,
    isLanguageLoading,
    supportedLanguages,
    clearLanguageOverride,
    isManualSelection,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
