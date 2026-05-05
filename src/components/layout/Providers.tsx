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

    useEffect(() => {
        initializeTheme();
        initialize();
    }, [initialize, initializeTheme]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" richColors theme={theme} />
        </QueryClientProvider>
    );
}
