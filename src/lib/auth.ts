import { jwtDecode } from "jwt-decode";
import { User } from "@/types";

interface JwtPayload {
  sub: string;
  tenantSlug: string;
  exp: number;
  iat: number;
}

export function getTokenPayload(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = getTokenPayload(token);
  if (!payload) return true;
  return Date.now() >= payload.exp * 1000;
}

export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  document.cookie = `accessToken=${accessToken}; path=/; max-age=${60 * 60 * 24}; samesite=lax`;
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  document.cookie = "accessToken=; path=/; max-age=0";
}

export function saveUser(user: Partial<User>) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredUser(): Partial<User> | null {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    clearTokens();
    return null;
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

export function getAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
}
