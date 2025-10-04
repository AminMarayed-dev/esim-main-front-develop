import { activationClient } from "./axios";

export interface ActivationReqBody {
  email: string;
  country: string;
  first_name:string | undefined;
  last_name:string | undefined;
}
export interface ActivationRes {
  ok: boolean;
  message?: string;
}

export async function sendActivationEmailAndQr(body: ActivationReqBody) {
  const { data } = await activationClient.post<ActivationRes>(
    "/api/send-country-email/",
    body
  );
  return data;
}
