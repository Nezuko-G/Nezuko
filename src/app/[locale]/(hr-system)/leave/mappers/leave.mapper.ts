import { z } from "zod";
import type { LeaveRequest } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";
import { LeaveRequestDTO } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";

type LeaveRequestDTOType = z.infer<typeof LeaveRequestDTO>;

export function mapLeaveRequestFromDTO(dto: LeaveRequestDTOType): LeaveRequest {
  return {
    id: dto.id,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    reason: dto.reason,
    status: dto.status,
    employeeId: dto.employeeId,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

export function mapLeaveRequestsFromDTO(dtoss: LeaveRequestDTOType[]): LeaveRequest[] {
  return dtoss.map(mapLeaveRequestFromDTO);
}