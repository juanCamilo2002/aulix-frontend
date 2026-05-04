"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function Providers({ children }: { children: React.ReactNode }) {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" richColors />
        </QueryClientProvider>
    );
}