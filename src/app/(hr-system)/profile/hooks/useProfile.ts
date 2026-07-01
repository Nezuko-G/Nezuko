"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; 
import { getMe, updateAvatar } from "@/app/(hr-system)/profile/api/profile.api"; 
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

export function useUpdateAvatar() {
    const queryClient = useQueryClient();
    const router = useRouter(); 
    const toast = useToast();

    return useMutation({
        mutationFn: async (file: File) => {
            return await updateAvatar(file);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            
            router.refresh(); 
            
            toast.success("Avatar updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error?.message || "Failed to update avatar");
        },
    });
}