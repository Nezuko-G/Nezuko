"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAttendance } from "@/app/[locale]/(hr-system)/attendance/api/attendance";
import { useToast } from "@/components/ui/toast";
import type { AttendanceError } from "@/app/[locale]/(hr-system)/attendance/api/attendance";

export function useAttendanceMark() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) => markAttendance(lat, lng),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["my-timesheets"] });
      const message =
        data.action === "checked_in"
          ? "Check-in recorded successfully"
          : "Check-out recorded successfully";
      toast.success(message);
    },
    onError: (error: unknown) => {
      const err = error as AttendanceError;

      if (err && err.code === "OUTSIDE_GEOFENCE") {
        const distance = err.distance ?? 0;
        const maxDistance = err.maxDistance ?? 0;
        toast.error(
          `You are ${distance}m away from the office. Maximum allowed is ${maxDistance}m.`
        );
        return;
      }

      if (err && err.code === "ALREADY_RECORDED") {
        return;
      }

      if (err && err.code === "FEATURE_DISABLED") {
        return;
      }

      const message =
        err?.message || (error instanceof Error
          ? error.message
          : "An unexpected error occurred");
      toast.error(message);
    },
  });
}
