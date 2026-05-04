"use client";

import { create } from "zustand";
import { User } from "@/types";
import {
  clearTokens,
  getAuthenticated,
  getStoredUser,
  saveTokens,
  saveUser,
} from "@/lib/auth";

interface AuthState {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  login: (tokens: { accessToken: string, refreshToken: string }, user: Partial<User>) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (tokens, user) => {
    saveTokens(tokens.accessToken, tokens.refreshToken);
    saveUser(user);
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const user = getStoredUser();

    if (user && getAuthenticated()) {
      set({ user, isAuthenticated: true });
      return;
    }

    clearTokens();
    set({ user: null, isAuthenticated: false });
  }
}));
