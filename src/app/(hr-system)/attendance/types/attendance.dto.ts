import { z } from "zod";

export const AttendanceActionEnum = z.enum(["checked_in", "checked_out"]);

export const MarkAttendanceResponseDTO = z.object({
  action: AttendanceActionEnum,
  checkIn: z.string().datetime().nullable(),
  checkOut: z.string().datetime().nullable().optional(),
  totalHours: z.number().nullable().optional(),
  overtimeHours: z.number().nullable().optional(),
});

export const MarkAttendanceErrorDTO = z.object({
  status: z.literal("error"),
  code: z.enum(["OUTSIDE_GEOFENCE", "FEATURE_DISABLED", "ALREADY_RECORDED"]),
  message: z.string(),
  data: z
    .object({
      distance: z.number().optional(),
      maxDistance: z.number().optional(),
    })
    .optional(),
});

export type AttendanceAction = z.infer<typeof AttendanceActionEnum>;
export type MarkAttendanceResponse = z.infer<typeof MarkAttendanceResponseDTO>;
export type MarkAttendanceError = z.infer<typeof MarkAttendanceErrorDTO>;
