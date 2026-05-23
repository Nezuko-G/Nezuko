import { z } from "zod";
import type { Timesheet, UserSummary } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";
import { TimesheetDTO, UserSummaryDTO } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";

type TimesheetDTOType = z.infer<typeof TimesheetDTO>;
type UserSummaryDTOType = z.infer<typeof UserSummaryDTO>;

function mapUserFromDTO(dto: UserSummaryDTOType): UserSummary {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    employeeCode: dto.employeeCode,
    departmentId: dto.departmentId,
    role: dto.role,
  };
}

export function mapTimesheetFromDTO(dto: TimesheetDTOType): Timesheet {
  return {
    id: dto.id,
    userId: dto.userId,
    date: new Date(dto.date),
    checkIn: dto.checkIn ? new Date(dto.checkIn) : null,
    checkOut: dto.checkOut ? new Date(dto.checkOut) : null,
    totalHours: dto.totalHours,
    overtimeHours: dto.overtimeHours,
    status: dto.status,
    notes: dto.notes,
    submittedBy: dto.submittedBy,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    user: dto.user ? mapUserFromDTO(dto.user) : null,
    submitter: dto.submitter ? mapUserFromDTO(dto.submitter) : null,
  };
}

export function mapTimesheetsFromDTO(dtos: TimesheetDTOType[]): Timesheet[] {
  return dtos.map(mapTimesheetFromDTO);
}
