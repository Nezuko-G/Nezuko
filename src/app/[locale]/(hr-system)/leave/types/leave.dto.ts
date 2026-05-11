import { z } from "zod";

export const LeaveStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const LeaveRequestDTO = z.object({
  id: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  reason: z.string().min(1),
  status: LeaveStatusEnum,
  employeeId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
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

export type LeaveRequest = {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateLeaveInput = z.infer<typeof CreateLeaveRequestDTO>;
export type ReviewLeaveInput = z.infer<typeof ReviewLeaveRequestDTO>;