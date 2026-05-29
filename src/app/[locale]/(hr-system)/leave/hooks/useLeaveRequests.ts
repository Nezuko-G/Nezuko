"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllLeaveRequests,
  getMyLeaveRequests,
  createLeaveRequest,
  reviewLeaveRequest,
  cancelLeaveRequest,
} from "@/app/[locale]/(hr-system)/leave/api/leave";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToast } from "@/components/ui/toast";

interface ApiErrorType extends Error {
  status?: number;
}

export function useLeaveRequests(filters?: { limit?: number; page?: number }) {
  const { role } = useAuthStore();
  const isHR = role === "HR_ADMIN" || role === "MANAGER";
  const toast = useToast();

  return useQuery({
    queryKey: ["leave-requests", filters, isHR],
    queryFn: async () => {
      console.log('[useLeaveRequests] Query function called, isHR:', isHR);
      try {
        const result = isHR ? await getAllLeaveRequests(filters) : await getMyLeaveRequests(filters);
        console.log('[useLeaveRequests] Query success:', result);
        return result;
      } catch (error) {
        console.log('[useLeaveRequests] Query error caught:', error);
        const err = error as ApiErrorType;
        toast.error(err?.message || "Failed to load leave requests");
        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Leave request created successfully");
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorType;
      toast.error(err?.message || "Failed to create leave request");
    },
  });
}

export function useReviewLeaveRequest() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: "APPROVED" | "REJECTED"; reviewNote?: string } }) => reviewLeaveRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Leave request reviewed");
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorType;
      toast.error(err?.message || "Failed to review leave request");
    },
  });
}

export function useCancelLeaveRequest() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: cancelLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast.success("Leave request cancelled");
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorType;
      toast.error(err?.message || "Failed to cancel leave request");
    },
  });
}