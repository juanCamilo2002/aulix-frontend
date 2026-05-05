"use client";

import { create } from "zustand";
import { User } from "@/types";
import {
  clearLegacyTokens,
  clearTokens,
  getStoredUser,
  saveUser,
} from "@/lib/auth";

interface AuthState {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  login: (user: Partial<User>) => void;
  logout: () => void;
  initialize: () => void;
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

  initialize: () => {
    clearLegacyTokens();
    const user = getStoredUser();

    if (user) {
      set({ user, isAuthenticated: true });
      return;
    }

    clearTokens();
    set({ user: null, isAuthenticated: false });
  }
}));
