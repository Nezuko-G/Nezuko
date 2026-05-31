"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/app/(hr-system)/dashboard/api/dashboard.api";
import { useToast } from "@/components/ui/toast";

interface ApiErrorType extends Error {
    status?: number;
}

export function useDashboard() {
    const toast = useToast();

    return useQuery({
        queryKey: ["dashboard"],
        queryFn: async () => {
            try {
                return await getDashboard();
            } catch (error) {
                const err = error as ApiErrorType;
                toast.error(err?.message || "Failed to load dashboard");
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}