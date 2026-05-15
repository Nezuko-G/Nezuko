import { z } from "zod";

export const TimesheetStatusEnum = z.enum(["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"]);

export const UserSummaryDTO = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  employeeCode: z.string().nullable(),
  departmentId: z.string().uuid().nullable(),
  role: z.string(),
});

export const TimesheetDTO = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  userId: z.string().uuid(),
  date: z.string().datetime(),
  checkIn: z.string().datetime().nullable(),
  checkOut: z.string().datetime().nullable(),
  totalHours: z.number(),
  overtimeHours: z.number(),
  status: TimesheetStatusEnum,
  notes: z.string().nullable(),
  submittedBy: z.string().uuid().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  user: UserSummaryDTO.nullable(),
  submitter: UserSummaryDTO.nullable(),
});

export type TimesheetStatus = z.infer<typeof TimesheetStatusEnum>;
export type UserSummary = z.infer<typeof UserSummaryDTO>;

export type Timesheet = {
  id: string;
  userId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  totalHours: number;
  overtimeHours: number;
  status: TimesheetStatus;
  notes: string | null;
  submittedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: UserSummary | null;
  submitter: UserSummary | null;
};
