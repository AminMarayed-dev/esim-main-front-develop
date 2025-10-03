import { activationClient } from "./axios";

export interface ActivationReqBody {
  email: string;
  country: string;
}
export interface ActivationRes {
  ok: boolean;
  message?: string;
}

export async function sendActivationEmailAndQr(body: ActivationReqBody) {
  const { data } = await activationClient.post<ActivationRes>(
    "/esim/activation-email",
    body
  );
  return data;
}
