"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllLeaveRequests,
  getMyLeaveRequests,
  createLeaveRequest,
  reviewLeaveRequest,
  cancelLeaveRequest,
} from "@/app/(hr-system)/leave/api/leave";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToast } from "@/components/ui/toast";

interface ApiErrorType extends Error {
  status?: number;
}

export function useLeaveRequests(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const { role } = useAuthStore();
  const isHR = role === "HR_ADMIN" || role === "MANAGER";

  return useQuery({
    queryKey: ["leave-requests", params, isHR],
    queryFn: async () => {
      try {
        return isHR ? await getAllLeaveRequests(params) : await getMyLeaveRequests(params);
      } catch (error) {
        const err = error as ApiErrorType;
        throw new Error(err?.message || "Failed to load leave requests");
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
