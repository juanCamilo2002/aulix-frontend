import { User } from "@/types";

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function clearLegacyTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
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
