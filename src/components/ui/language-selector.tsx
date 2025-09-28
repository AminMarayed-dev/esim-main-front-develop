import { Globe } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const { currentLanguage, setCurrentLanguage, supportedLanguages } =
    useLanguage();

  const currentLangInfo = supportedLanguages.find(
    (lang) => lang.code === currentLanguage
  );

  const handleLanguageChange = (language: string) => {
    // Mark this as a manual selection
    setCurrentLanguage(language, true);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Globe className="h-4 w-4 text-gray-500" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px] h-8 border-0 bg-transparent focus:ring-0 focus:ring-offset-0">
          <SelectValue>
            <div className="flex items-center space-x-2">
              <span className="text-sm">{currentLangInfo?.flag}</span>
              <span className="text-sm font-medium">
                {currentLangInfo?.name}
              </span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center space-x-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
