// src/lib/email.ts
import emailjs from '@emailjs/browser';
import type { CountryCode } from '@/constants/esim-presets';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;
const TEMPLATE_IR = import.meta.env.VITE_EMAILJS_TEMPLATE_IR as string;
const TEMPLATE_SA = import.meta.env.VITE_EMAILJS_TEMPLATE_SA as string;
const TEMPLATE_DE = import.meta.env.VITE_EMAILJS_TEMPLATE_DE as string;

const TEMPLATE_BY_COUNTRY: Record<CountryCode, string> = {
  IR: TEMPLATE_IR,
  SA: TEMPLATE_SA,
  DE: TEMPLATE_DE,
};

export async function sendEsimEmail(params: {
  to_email: string;
  first_name: string;
  last_name: string;
  country: CountryCode;     // 'IR' | 'SA' | 'DE'
  activation_code: string;
  qr_url: string;
}) {
  const template_id = TEMPLATE_BY_COUNTRY[params.country];
  const countryLabel =
    params.country === 'IR' ? 'ایران' : params.country === 'SA' ? 'عربستان' : 'آلمان';

  return emailjs.send(
    SERVICE_ID,
    template_id,
    { ...params, country: countryLabel },
    { publicKey: PUBLIC_KEY }
  );
}
