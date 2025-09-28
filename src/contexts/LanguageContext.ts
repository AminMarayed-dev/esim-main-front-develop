import { createContext } from "react";
import type { GeolocationResponse } from "../services/geolocation";

export interface LanguageContextType {
  currentLanguage: string;
  setCurrentLanguage: (language: string, isManualSelection?: boolean) => void;
  geolocationData: GeolocationResponse | null;
  isLanguageLoading: boolean;
  supportedLanguages: { code: string; name: string; flag: string }[];
  clearLanguageOverride: () => void;
  isManualSelection: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);
