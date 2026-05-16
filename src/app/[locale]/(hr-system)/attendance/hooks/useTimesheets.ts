"use client";

import { useQuery } from "@tanstack/react-query";
import { getTimesheets, type TimesheetFilters } from "@/app/[locale]/(hr-system)/attendance/api/timesheet";
import { useToast } from "@/components/ui/toast";

interface ApiErrorType extends Error {
  status?: number;
}

export function useTimesheets(filters?: TimesheetFilters) {
  const toast = useToast();

  return useQuery({
    queryKey: ["timesheets", filters],
    queryFn: async () => {
      try {
        return await getTimesheets(filters);
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
