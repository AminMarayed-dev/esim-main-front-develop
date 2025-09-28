// src/constants/esim-presets.ts
export type CountryCode = 'IR' | 'SA' | 'DE';

export const ACTIVATION_BY_COUNTRY: Record<CountryCode, string> = {
  IR: 'LPA:1$rsp-3104.idemia.io$F85FR-0S65T-YQLRB-2UZY2',
  SA: 'LPA:1$rsp-3104.idemia.io$UGOQM-URWIV-C2DHQ-ZCGUC', // از پیام شما
  DE: 'LPA:1$rsp-3104.idemia.io$O26SF-PQ4IA-KGTNC-WRZ0E',          // این را جایگزین کن
};

export const QR_BY_COUNTRY: Record<CountryCode, string> = {
  IR: `${window.location.origin}/qrs/iran.png`,
  SA: `${window.location.origin}/qrs/arabia.png`,
  DE: `${window.location.origin}/qrs/germany.png`,
};
