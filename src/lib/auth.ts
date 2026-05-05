import { User } from "@/types";

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

export function saveUser(user: Partial<User>) {
  localStorage.setItem("user", JSON.stringify(user));
}
