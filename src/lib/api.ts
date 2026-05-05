import axios, { type AxiosRequestConfig } from "axios";
import { clearTokens } from "@/lib/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

type RetriableRequest = AxiosRequestConfig & { _retry?: boolean };
const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"];

api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  const csrfToken = getCookie("csrfToken");

  if (method && MUTATING_METHODS.has(method) && csrfToken) {
    config.headers.set("X-CSRF-Token", csrfToken);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetriableRequest | undefined;
    const requestUrl = originalRequest?.url ?? "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) =>
      requestUrl.includes(endpoint)
    );
    const canRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint;

    if (canRefresh) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        clearTokens();

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    } else if (error.response?.status === 401 && !isAuthEndpoint) {
      clearTokens();

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1] ?? null;
}

export default api;
