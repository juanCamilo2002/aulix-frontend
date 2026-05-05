"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

export default function Providers({ children }: { children: React.ReactNode }) {
    const initialize = useAuthStore((state) => state.initialize);
    const initializeTheme = useThemeStore((state) => state.initialize);
    const theme = useThemeStore((state) => state.theme);
    const isInitializing = useAuthStore((state) => state.isInitializing);

    useEffect(() => {
        initializeTheme();
        void initialize();
    }, [initialize, initializeTheme]);

    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" richColors theme={theme} />
        </QueryClientProvider>
    );
}
