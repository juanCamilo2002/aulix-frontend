"use client";

import { create } from "zustand";
import { ApiResponse, User } from "@/types";
import {
  clearLegacyTokens,
  clearTokens,
  saveUser,
} from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface AuthState {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  login: (user: Partial<User>) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (user) => {
    saveUser(user);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  initialize: async () => {
    clearLegacyTokens();

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Session is not valid");
      }

      const body = (await response.json()) as ApiResponse<Partial<User>>;
      if (!body.data) {
        throw new Error("Session response missing user");
      }

      saveUser(body.data);
      set({ user: body.data, isAuthenticated: true });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false });
    }
  }
}));
