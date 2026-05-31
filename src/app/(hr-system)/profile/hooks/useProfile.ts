"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/profile.api";
import { useToast } from "@/components/ui/toast";

interface ApiErrorType extends Error {
    status?: number;
}

export function useProfile() {
    const toast = useToast();

    return useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            try {
                return await getMe();
            } catch (error) {
                const err = error as ApiErrorType;
                toast.error(err?.message || "Failed to load profile");
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}
