//

import { z } from "zod";

/* ---------------------------------- Step 1 --------------------------------- */
// Helper function to create localized schema (this will be enhanced later)
const createStep1Schema = () =>
  z.object({
    firstName: z.string().min(2, "validation.firstNameMin"),
    lastName: z.string().min(2, "validation.lastNameMin"),
    nationalId: z.string().regex(/^\d{10}$/, "validation.nationalIdFormat"),
    email: z.string().email("validation.email"), // ← change from min(2) to email()
  });

// Step 1 Schema
export const step1Schema = createStep1Schema();

/* ---------------------------------- Step 2 --------------------------------- */
export const step2Schema = z.object({
  idCardPhoto: z
    .instanceof(File)
    .optional()
    .refine((file) => file && file.size > 0, "validation.selectIdCard"),
  videoVerification: z.object({
    videoBlob: z.any().optional(),
    isVerified: z.boolean(),
    verificationStatus: z.enum(["pending", "approved", "rejected"]),
    verificationMessage: z.string().optional(),
  }),
});

/* ---------------------------------- Step 3 --------------------------------- */
export const step3Schema = z.object({
  selectedNumbers: z.array(z.string()).min(1, "validation.selectNumbers"),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, "validation.acceptTerms"),
});

/* ---------------------------------- Step 4 --------------------------------- */
export const step4Schema = z.object({
  esimLineType: z.string(),
  isFirstSimCard: z.boolean(),
  selectedServices: z.array(z.string()).optional(),
});

/* ---------------------- NEW: Step 5 (Continent & Country) ------------------ */
/**
 * Continent and Country configuration
 */
export const CONTINENTS = [
  "Asia",
  "Europe",
  "America",
  "Australia",
  "Africa",
] as const;
export type Continent = (typeof CONTINENTS)[number];

// Continents that remain disabled in the UI
export const ENABLED_CONTINENTS = ["Asia", "Europe"] as const;
export const DISABLED_CONTINENTS = ["America", "Australia", "Africa"] as const;

export const COUNTRY_BY_CONTINENT = {
  Asia: ["Iran", "Arabia"] as const,
  Europe: ["Germany"] as const,
} as const;

export type AsiaCountry = (typeof COUNTRY_BY_CONTINENT)["Asia"][number];
export type EuropeCountry = (typeof COUNTRY_BY_CONTINENT)["Europe"][number];
export type Country = AsiaCountry | EuropeCountry;

/**
 * Step 5 Schema
 * - Continent is required (but some are disabled in UI).
 * - If Asia or Europe is selected, `country` is required and must be valid for that continent.
 * - If a disabled continent is chosen (shouldn't happen from UI), `country` must not be set.
 */
export const step5Schema = z
  .object({
    continent: z.enum(CONTINENTS, {
      required_error: "validation.selectContinent",
    }),
    country: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isAsiaOrEurope =
      data.continent === "Asia" || data.continent === "Europe";
    if (isAsiaOrEurope) {
      if (!data.country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "validation.selectCountry",
          path: ["country"],
        });
        return;
      }
      const validSet =
        data.continent === "Asia"
          ? new Set<string>(COUNTRY_BY_CONTINENT.Asia as readonly string[])
          : new Set<string>(COUNTRY_BY_CONTINENT.Europe as readonly string[]);
      if (!validSet.has(data.country)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "validation.invalidCountryForContinent",
          path: ["country"],
        });
      }
    } else {
      // For disabled continents, no country must be supplied
      if (data.country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "validation.countryNotAllowed",
          path: ["country"],
        });
      }
    }
  });

/* ---------------------------------- Step 6 --------------------------------- */
// Step 6 Schema (Payment)
export const step6Schema = z.object({
  paymentMethod: z.string().min(1, "validation.selectPaymentMethod"),
  paymentGateway: z.enum(["internal", "external"]),
  amount: z.number().positive(),
  currency: z.string(),
  transactionId: z.string().optional(),
  paymentStatus: z.enum(["pending", "completed", "failed"]),
});

/* ---------------------------------- Types ---------------------------------- */
export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;
export type Step4FormData = z.infer<typeof step4Schema>;
export type Step5FormData = z.infer<typeof step5Schema>;
export type Step6FormData = z.infer<typeof step6Schema>;

/* --------------------------- Available Numbers Type ------------------------ */
export interface PhoneNumber {
  number: string;
  isFavorite: boolean;
  isSelected: boolean;
}

/* ------------------------------- Phone Prefixes ---------------------------- */
export const PHONE_PREFIXES = ["09999"] as const;
export type PhonePrefix = (typeof PHONE_PREFIXES)[number];

/* ------------------------------ Search Form Type --------------------------- */
export interface SearchForm {
  prefix: PhonePrefix | "";
  digits: [string, string, string, string, string, string, string];
}

/* -------- eSIM Line Types (i18n keys; use t(`step4.esimLineTypes.${key}`)) -- */
export const ESIM_LINE_TYPES = ["esimCredit", "esimPermanent"] as const;
export type EsimLineTypeKey = (typeof ESIM_LINE_TYPES)[number];

/* -------- Services (i18n keys; use t(`services.${key}`)) ------------------- */
export const AVAILABLE_SERVICES = [
  "internet",
  "contentEntertainment",
  "foreignGuestSim",
  "convergenceInternational",
  "paymentServices",
  "callServices",
  "smsServices",
  "iptvServices",
] as const;
export type ServiceKey = (typeof AVAILABLE_SERVICES)[number];

/** Helpers to build translation keys (optional) */
export const getEsimLineTypeI18nKey = (key: EsimLineTypeKey) =>
  `step4.esimLineTypes.${key}` as const;
export const getServiceI18nKey = (key: ServiceKey) =>
  `services.${key}` as const;

/* --------- (Deprecated) Operators — kept for backward compatibility -------- */
/** @deprecated Not used in Step 5 anymore */
export const DOMESTIC_OPERATORS = ["همراه اول", "ایرانسل", "رایتل"] as const;
/** @deprecated Not used in Step 5 anymore */
export const FOREIGN_OPERATORS = [
  "vodafone",
  "t-mobile",
  "AT&T",
  "Deutsche telekon",
  "telefonica",
] as const;

export type DomesticOperatorType = (typeof DOMESTIC_OPERATORS)[number];
export type ForeignOperatorType = (typeof FOREIGN_OPERATORS)[number];

/* ------------------------------- Payment Methods --------------------------- */
export const INTERNAL_PAYMENT_METHODS = [
  "ZarinPal",
  "Sadad",
  "Mellat Bank",
  "Parsian Bank",
  "Pasargad Bank",
  "Saman Bank",
] as const;

export const EXTERNAL_PAYMENT_METHODS = [
  "PayPal",
  "Visa Card",
  "Mastercard",
  "Skrill",
  "Envato Market Credit",
  "Apple Pay",
  "Google Pay",
] as const;

export const CRYPTOCURRENCY_METHODS = [
  "Bitcoin (BTC)",
  "Ethereum (ETH)",
  "Tether (USDT)",
  "TRON (TRX)",
  "Binance Coin (BNB)",
  "Cardano (ADA)",
  "Solana (SOL)",
  "Dogecoin (DOGE)",
] as const;

export type InternalPaymentMethodType =
  (typeof INTERNAL_PAYMENT_METHODS)[number];
export type ExternalPaymentMethodType =
  (typeof EXTERNAL_PAYMENT_METHODS)[number];
export type CryptocurrencyMethodType = (typeof CRYPTOCURRENCY_METHODS)[number];
