"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTimesheets,
  getMyTimesheets,
  submitTimesheet,
  editTimesheet,
  reviewTimesheet,
  getOvertimeReport,
  type TimesheetListFilters,
  type OvertimeReportFilters,
} from "@/app/[locale]/(hr-system)/timesheets/api/timesheets";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useToast } from "@/components/ui/toast";
import type { SubmitTimesheetInput, EditTimesheetInput, ReviewTimesheetInput } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";

interface ApiErrorType extends Error {
  status?: number;
}

export function useTimesheets(filters?: TimesheetListFilters) {
  const { role } = useAuthStore();
  const isHR = role === "HR" || role === "MANAGER";
  const toast = useToast();

  return useQuery({
    queryKey: ["timesheets", filters, isHR],
    queryFn: async () => {
      try {
        return isHR ? await getTimesheets(filters) : await getMyTimesheets();
      } catch (error) {
        const err = error as ApiErrorType;
        toast.error(err?.message || "Failed to load timesheets");
        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useSubmitTimesheet() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (data: SubmitTimesheetInput) => submitTimesheet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      toast.success("Timesheet submitted successfully");
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorType;
      if (err?.status === 409) {
        toast.error(err.message);
      } else {
        toast.error(err?.message || "Failed to submit timesheet");
      }
    },
  });
}

export function useEditTimesheet() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditTimesheetInput }) => editTimesheet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      toast.success("Timesheet updated successfully");
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorType;
      toast.error(err?.message || "Failed to update timesheet");
    },
  });
}

export function useReviewTimesheet() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewTimesheetInput }) => reviewTimesheet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timesheets"] });
      toast.success("Timesheet reviewed successfully");
    },
    onError: (error: unknown) => {
      const err = error as ApiErrorType;
      toast.error(err?.message || "Failed to review timesheet");
    },
  });
}

export function useMyTimesheets() {
  const toast = useToast();

  return useQuery({
    queryKey: ["timesheets", "me"],
    queryFn: async () => {
      try {
        return await getMyTimesheets();
      } catch (error) {
        const err = error as ApiErrorType;
        toast.error(err?.message || "Failed to load timesheets");
        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useOvertimeReport(filters: OvertimeReportFilters) {
  const toast = useToast();

  return useQuery({
    queryKey: ["timesheets-overtime", filters],
    queryFn: async () => {
      try {
        return await getOvertimeReport(filters);
      } catch (error) {
        const err = error as ApiErrorType;
        toast.error(err?.message || "Failed to load overtime report");
        throw error;
      }
    },
    retry: false,
    staleTime: 0,
    gcTime: 0,
    enabled: !!filters.startDate && !!filters.endDate,
  });
}
