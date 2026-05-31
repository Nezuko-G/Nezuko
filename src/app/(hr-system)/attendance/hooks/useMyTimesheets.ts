"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyTimesheets, type TimesheetFilters } from "@/app/(hr-system)/attendance/api/attendance";
import { useToast } from "@/components/ui/toast";

interface ApiErrorType extends Error {
  status?: number;
}

export function useMyTimesheets(filters?: TimesheetFilters) {
  const toast = useToast();

  return useQuery({
    queryKey: ["my-timesheets", filters],
    queryFn: async () => {
      try {
        return await getMyTimesheets(filters);
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
