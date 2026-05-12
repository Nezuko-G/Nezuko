import { z } from "zod";

export const LeaveStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const UserDTO = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  employeeCode: z.string(),
  role: z.string(),
  departmentId: z.string().uuid().nullable(),
});

export const LeaveRequestDTO = z.object({
  id: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().min(1),
  status: LeaveStatusEnum,
  userId: z.string().uuid(),
  reviewerId: z.string().uuid().nullable(),
  reviewNote: z.string().nullable(),
  reviewedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  user: UserDTO.nullable(),
  reviewer: UserDTO.nullable(),
});

export const CreateLeaveRequestDTO = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().min(1),
});

export const ReviewLeaveRequestDTO = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().optional(),
});

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeCode: string;
  role: string;
  departmentId: string | null;
};

export type LeaveRequest = {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  userId: string;
  reviewerId: string | null;
  reviewNote: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  reviewer?: User;
};

export type CreateLeaveInput = z.infer<typeof CreateLeaveRequestDTO>;
export type ReviewLeaveInput = z.infer<typeof ReviewLeaveRequestDTO>;