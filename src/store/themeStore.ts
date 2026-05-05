"use client";

import { create } from "zustand";

export type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

interface ThemeState {
  theme: Theme;
  initialize: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",

  initialize: () => {
    const theme = getStoredTheme();
    applyTheme(theme);
    set({ theme });
  },

  setTheme: (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === "dark" ? "light" : "dark";
    get().setTheme(nextTheme);
  },
}));
