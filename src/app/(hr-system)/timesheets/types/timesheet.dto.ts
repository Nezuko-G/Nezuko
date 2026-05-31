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

export const TimesheetEntryDTO = z.object({
  userId: z.string().uuid(),
  date: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  notes: z.string().optional(),
});

export const TimesheetDTO = z.object({
  id: z.string().uuid(),
  tenantId: z.string().optional(),
  userId: z.string().uuid(),
  date: z.string(),
  checkIn: z.string().nullable(),
  checkOut: z.string().nullable(),
  totalHours: z.number(),
  overtimeHours: z.number(),
  status: TimesheetStatusEnum,
  notes: z.string().nullable(),
  submittedBy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: UserSummaryDTO.nullable(),
  submitter: UserSummaryDTO.nullable(),
});

export const SubmitTimesheetDTO = z.object({
  status: z.enum(["draft", "submitted"]),
  entries: z.array(TimesheetEntryDTO).min(1),
});

export const EditTimesheetDTO = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["draft", "submitted"]).optional(),
});

export const ReviewTimesheetDTO = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewNote: z.string().optional(),
});

export const OvertimeReportItemDTO = z.object({
  userId: z.string(),
  employeeName: z.string(),
  departmentId: z.string().nullable(),
  departmentName: z.string().nullable(),
  date: z.string(),
  totalHours: z.number(),
  overtimeHours: z.number(),
});

export const OvertimeReportDTO = z.object({
  items: z.array(OvertimeReportItemDTO),
  totalOvertime: z.number(),
});

export type TimesheetStatus = z.infer<typeof TimesheetStatusEnum>;
export type UserSummary = z.infer<typeof UserSummaryDTO>;
export type TimesheetEntry = z.infer<typeof TimesheetEntryDTO>;
export type SubmitTimesheetInput = z.infer<typeof SubmitTimesheetDTO>;
export type EditTimesheetInput = z.infer<typeof EditTimesheetDTO>;
export type ReviewTimesheetInput = z.infer<typeof ReviewTimesheetDTO>;
export type OvertimeReportItem = z.infer<typeof OvertimeReportItemDTO>;
export type OvertimeReport = z.infer<typeof OvertimeReportDTO>;

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
