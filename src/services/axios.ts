import axios from "axios";

export const activationClient = axios.create({
  baseURL:
    import.meta.env.VITE_ACTIVATION_API_BASE_URL || "http://194.180.11.12:8004",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
