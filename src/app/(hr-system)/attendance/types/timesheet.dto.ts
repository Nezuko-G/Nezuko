import { z } from "zod";

export const TimesheetStatusEnum = z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"]);

export const UserSummaryDTO = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  employeeCode: z.string().nullable().optional(),
  departmentId: z.string().uuid().nullable().optional(),
  role: z.string(),
});

export const TimesheetDTO = z.object({
  id: z.string().uuid(),
  tenantId: z.string(),
  userId: z.string().uuid(),
  date: z.string().datetime(),
  checkIn: z.string().datetime().nullable(),
  checkOut: z.string().datetime().nullable(),
  totalHours: z.number().nullable(),
  overtimeHours: z.number().nullable(),
  status: TimesheetStatusEnum,
  notes: z.string().nullable(),
  submittedBy: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  user: UserSummaryDTO.nullish(),
  submitter: UserSummaryDTO.nullish(),
});

export type TimesheetStatus = z.infer<typeof TimesheetStatusEnum>;
export type UserSummary = z.infer<typeof UserSummaryDTO>;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Timesheet = {
  id: string;
  userId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  totalHours: number | null;
  overtimeHours: number | null;
  status: TimesheetStatus;
  notes: string | null;
  submittedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: UserSummary | null;
  submitter: UserSummary | null;
};
