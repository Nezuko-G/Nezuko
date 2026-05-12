import { z } from "zod";
import type { LeaveRequest, User } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";
import { LeaveRequestDTO, UserDTO } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";

type LeaveRequestDTOType = z.infer<typeof LeaveRequestDTO>;
type UserDTOType = z.infer<typeof UserDTO>;

function mapUserFromDTO(dto: UserDTOType): User {
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    email: dto.email,
    employeeCode: dto.employeeCode,
    role: dto.role,
    departmentId: dto.departmentId,
  };
}

export function mapLeaveRequestFromDTO(dto: LeaveRequestDTOType): LeaveRequest {
  return {
    id: dto.id,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    reason: dto.reason,
    status: dto.status,
    userId: dto.userId,
    reviewerId: dto.reviewerId,
    reviewNote: dto.reviewNote,
    reviewedAt: dto.reviewedAt ? new Date(dto.reviewedAt) : null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    user: dto.user ? mapUserFromDTO(dto.user) : undefined,
    reviewer: dto.reviewer ? mapUserFromDTO(dto.reviewer) : undefined,
  };
}

export function mapLeaveRequestsFromDTO(dtoss: LeaveRequestDTOType[]): LeaveRequest[] {
  return dtoss.map(mapLeaveRequestFromDTO);
}