import type { z } from "zod";
import type { MarkAttendanceResponseDTO } from "@/app/[locale]/(hr-system)/attendance/types/attendance.dto";

type MarkResponseDTO = z.infer<typeof MarkAttendanceResponseDTO>;

export interface MarkAttendanceResult {
  action: "checked_in" | "checked_out";
  checkIn: Date | null;
  checkOut: Date | null;
  totalHours: number | null;
  overtimeHours: number | null;
}

export function mapMarkAttendanceFromDTO(dto: MarkResponseDTO): MarkAttendanceResult {
  return {
    action: dto.action,
    checkIn: dto.checkIn ? new Date(dto.checkIn) : null,
    checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
    totalHours: dto.totalHours ?? null,
    overtimeHours: dto.overtimeHours ?? null,
  };
}
