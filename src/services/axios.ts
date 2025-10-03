import axios from "axios";

export const activationClient = axios.create({
  baseURL:
    import.meta.env.VITE_ACTIVATION_API_BASE_URL || "https://api.example.com",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});
