import { z } from "zod";

export const LeaveTypeEnum = z.enum(["ANNUAL", "SICK", "OFFICIAL", "UNPAID"]);
export const LeaveStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const LeaveRequestDTO = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  employeeName: z.string().optional(),
  type: LeaveTypeEnum,
  startDate: z.string(),
  endDate: z.string(),
  status: LeaveStatusEnum,
  reason: z.string().optional(),
  reviewNote: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LeaveRequest = z.infer<typeof LeaveRequestDTO>;

export const CreateLeaveRequestDTO = z.object({
  type: LeaveTypeEnum,
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().optional(),
});

export type CreateLeaveRequestInput = z.infer<typeof CreateLeaveRequestDTO>;

export const ReviewLeaveRequestDTO = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().optional(),
});

export type ReviewLeaveRequestInput = z.infer<typeof ReviewLeaveRequestDTO>;

export const LeaveBalanceDTO = z.object({
  annual: z.object({
    total: z.number(),
    used: z.number(),
    remaining: z.number(),
  }),
  sick: z.object({
    total: z.number(),
    used: z.number(),
    remaining: z.number(),
  }),
  official: z.object({
    total: z.number(),
    used: z.number(),
    remaining: z.number(),
  }),
  unpaid: z.object({
    total: z.number(),
    used: z.number(),
    remaining: z.number(),
  }),
});

export type LeaveBalance = z.infer<typeof LeaveBalanceDTO>;

export const LeaveRequestListResponseDTO = z.object({
  data: z.array(LeaveRequestDTO),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type LeaveRequestListResponse = z.infer<typeof LeaveRequestListResponseDTO>;