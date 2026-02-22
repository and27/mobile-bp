import axios from "axios";
import { AppError } from "../errors/AppError";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!baseURL) {
  throw new Error("Missing EXPO_PUBLIC_API_BASE_URL environment variable");
}

export const httpClient = axios.create({
  baseURL,
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new AppError("NETWORK_ERROR", "Network error"));
    }
    const status = error.response.status as number;
    const message = error.response?.data?.message ?? "Http error";
    return Promise.reject(new AppError("HTTP_ERROR", message, status));
  },
);
