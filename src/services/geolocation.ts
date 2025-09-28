import axios from "axios";

export interface GeolocationResponse {
  ip: string;
  location: {
    continent_code: string;
    continent_name: string;
    country_code2: string;
    country_code3: string;
    country_name: string;
    country_name_official: string;
    country_capital: string;
    state_prov: string;
    state_code: string;
    district: string;
    city: string;
    zipcode: string;
    latitude: string;
    longitude: string;
    is_eu: boolean;
    country_flag: string;
    geoname_id: string;
    country_emoji: string;
  };
  country_metadata: {
    calling_code: string;
    tld: string;
    languages: string[];
  };
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
}

const GEOLOCATION_API_KEY = "55368de479c64f2bbe1689223147705b";
const GEOLOCATION_API_URL = `https://api.ipgeolocation.io/v2/ipgeo?apiKey=${GEOLOCATION_API_KEY}`;

/**
 * Fetch user's geolocation data based on their IP address
 */
export const getUserGeolocation =
  async (): Promise<GeolocationResponse | null> => {
    try {
      const response = await axios.get<GeolocationResponse>(
        GEOLOCATION_API_URL,
        {
          timeout: 10000, // 10 seconds timeout
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch geolocation data:", error);
      return null;
    }
  };

/**
 * Map country codes to supported languages
 * This function determines the best language based on the user's country
 */
export const getLanguageFromCountryCode = (countryCode: string): string => {
  const countryToLanguageMap: Record<string, string> = {
    // English-speaking countries
    US: "en", // United States
    GB: "en", // United Kingdom
    CA: "en", // Canada
    AU: "en", // Australia
    NZ: "en", // New Zealand
    IE: "en", // Ireland
    ZA: "en", // South Africa
    IN: "en", // India
    SG: "en", // Singapore
    MY: "en", // Malaysia
    PH: "en", // Philippines
    KE: "en", // Kenya
    NG: "en", // Nigeria
    GH: "en", // Ghana

    // Persian/Farsi-speaking countries
    IR: "fa", // Iran
    AF: "fa", // Afghanistan
    TJ: "fa", // Tajikistan

    // Arabic-speaking countries
    SA: "ar", // Saudi Arabia
    AE: "ar", // United Arab Emirates
    EG: "ar", // Egypt
    QA: "ar", // Qatar
    KW: "ar", // Kuwait
    BH: "ar", // Bahrain
    OM: "ar", // Oman
    JO: "ar", // Jordan
    LB: "ar", // Lebanon
    SY: "ar", // Syria
    IQ: "ar", // Iraq
    YE: "ar", // Yemen
    LY: "ar", // Libya
    TN: "ar", // Tunisia
    DZ: "ar", // Algeria
    MA: "ar", // Morocco
    SD: "ar", // Sudan
    SO: "ar", // Somalia
    KM: "ar", // Comoros
    MR: "ar", // Mauritania

    // Turkish-speaking countries
    TR: "tr", // Turkey
    CY: "tr", // Cyprus (Northern part)

    // French-speaking countries
    FR: "fr", // France
    BE: "fr", // Belgium
    LU: "fr", // Luxembourg
    MC: "fr", // Monaco
    CD: "fr", // Democratic Republic of Congo
    CG: "fr", // Republic of Congo
    CI: "fr", // Ivory Coast
    SN: "fr", // Senegal
    ML: "fr", // Mali
    BF: "fr", // Burkina Faso
    NE: "fr", // Niger
    TD: "fr", // Chad
    CF: "fr", // Central African Republic
    CM: "fr", // Cameroon
    GA: "fr", // Gabon
    MG: "fr", // Madagascar
    MU: "fr", // Mauritius
    SC: "fr", // Seychelles
    RW: "fr", // Rwanda
    BI: "fr", // Burundi
    VU: "fr", // Vanuatu
    NC: "fr", // New Caledonia
    PF: "fr", // French Polynesia

    // German-speaking countries (Switzerland can speak both French and German, defaulting to German)
    DE: "de", // Germany
    AT: "de", // Austria
    CH: "de", // Switzerland
    LI: "de", // Liechtenstein

    // Spanish-speaking countries
    ES: "es", // Spain
    MX: "es", // Mexico
    AR: "es", // Argentina
    CO: "es", // Colombia
    PE: "es", // Peru
    VE: "es", // Venezuela
    CL: "es", // Chile
    EC: "es", // Ecuador
    BO: "es", // Bolivia
    PY: "es", // Paraguay
    UY: "es", // Uruguay
    CR: "es", // Costa Rica
    PA: "es", // Panama
    GT: "es", // Guatemala
    HN: "es", // Honduras
    NI: "es", // Nicaragua
    SV: "es", // El Salvador
    DO: "es", // Dominican Republic
    CU: "es", // Cuba
    PR: "es", // Puerto Rico

    // Russian-speaking countries
    RU: "ru", // Russia
    BY: "ru", // Belarus
    KZ: "ru", // Kazakhstan
    KG: "ru", // Kyrgyzstan
    UZ: "ru", // Uzbekistan
    TM: "ru", // Turkmenistan
    MD: "ru", // Moldova
    AM: "ru", // Armenia
    AZ: "ru", // Azerbaijan
    GE: "ru", // Georgia
  };

  return countryToLanguageMap[countryCode] || "en"; // Default to English if country not found
};

/**
 * Get the appropriate language based on user's geolocation
 */
export const detectUserLanguage = async (): Promise<string> => {
  try {
    const geolocationData = await getUserGeolocation();

    if (geolocationData?.location?.country_code2) {
      const detectedLanguage = getLanguageFromCountryCode(
        geolocationData.location.country_code2
      );
      console.log(
        `Detected country: ${geolocationData.location.country_name} (${geolocationData.location.country_code2})`
      );
      console.log(`Selected language: ${detectedLanguage}`);
      return detectedLanguage;
    }

    // Fallback to English if no geolocation data
    console.log("No geolocation data available, falling back to English");
    return "en";
  } catch (error) {
    console.error("Error detecting user language:", error);
    return "en"; // Default to English on error
  }
};
