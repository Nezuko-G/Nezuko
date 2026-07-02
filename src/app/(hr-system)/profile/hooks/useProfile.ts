"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateAvatar } from "../api/profile.api";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/hooks/useAuthStore";
import { fileToBase64 } from "@/lib/avatar";

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

export function useUpdateAvatar() {
    const queryClient = useQueryClient();
    const setAvatarBase64 = useAuthStore((s) => s.setAvatarBase64);
    const toast = useToast();

    return useMutation({
        mutationFn: async (file: File) => {
            const result = await updateAvatar(file);
            const base64 = await fileToBase64(file);
            setAvatarBase64(base64);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Avatar updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Failed to update avatar");
        },
    });
}
