import { z } from "zod";

// ─── Company Info ────────────────────────────────────────────────

export const CompanyInfoDTO = z.object({
  name: z.string(),
  industry: z.string().nullable(),
  country: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  taxNumber: z.string().nullable(),
  commercialReg: z.string().nullable(),
  currency: z.string().nullable(),
  timezone: z.string().nullable(),
  logoUrl: z.string().nullable(),
});

export const CompanyInfoResponseDTO = z.object({
  status: z.literal("success"),
  data: CompanyInfoDTO,
});

export const UpdateCompanyInfoRequestDTO = z.object({
  name: z.string().min(1).optional(),
  industry: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  taxNumber: z.string().optional(),
  commercialReg: z.string().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
});

// ─── General Settings ────────────────────────────────────────────

export const GeneralSettingsDTO = z.object({
  language: z.enum(["ar", "en"]),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]),
  fiscalYearStart: z.number().int().min(1).max(12),
});

export const GeneralSettingsResponseDTO = z.object({
  status: z.literal("success"),
  data: GeneralSettingsDTO,
});

export const UpdateGeneralSettingsRequestDTO = z.object({
  language: z.enum(["ar", "en"]).optional(),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]).optional(),
  fiscalYearStart: z.number().int().min(1).max(12).optional(),
});

// ─── Attendance Settings ─────────────────────────────────────────

const DAY_NAME_MAP: Record<string, number> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

const dayNameToNum = z.string().transform((val) => DAY_NAME_MAP[val]).pipe(z.number().int().min(0).max(6));

export const AttendanceSettingsDTO = z.object({
  workDayStart: z.string(),
  workDayEnd: z.string(),
  workingDays: z.array(dayNameToNum),
  lateGraceMinutes: z.number().int().min(0).max(120),
  earlyLeaveGrace: z.number().int().min(0).max(120),
  overtimeThreshold: z.number().int(),
  roundingEnabled: z.boolean(),
  roundingMinutes: z.number().int().nullable(),
  requireBiometric: z.boolean(),
  geofenceEnabled: z.boolean(),
  locationAttendanceEnabled: z.boolean().nullable().default(false),
  requireLocation: z.boolean().nullable().default(false),
  geofenceLat: z.number().nullable(),
  geofenceLng: z.number().nullable(),
  geofenceRadiusM: z.number().nullable(),
});

export const AttendanceSettingsResponseDTO = z.object({
  status: z.literal("success"),
  data: AttendanceSettingsDTO,
});

export const UpdateAttendanceSettingsRequestDTO = z.object({
  workDayStart: z.string().optional(),
  workDayEnd: z.string().optional(),
  workingDays: z.array(z.number().int().min(0).max(6)).optional(),
  lateGraceMinutes: z.number().int().min(0).max(120).optional(),
  earlyLeaveGrace: z.number().int().min(0).max(120).optional(),
  overtimeThreshold: z.number().int().optional(),
  roundingEnabled: z.boolean().optional(),
  roundingMinutes: z.number().int().nullable().optional(),
  requireBiometric: z.boolean().optional(),
  geofenceEnabled: z.boolean().optional(),
  locationAttendanceEnabled: z.boolean().optional(),
  requireLocation: z.boolean().optional(),
  geofenceLat: z.number().nullable().optional(),
  geofenceLng: z.number().nullable().optional(),
  geofenceRadiusM: z.number().nullable().optional(),
});

// ─── Inferred Types ──────────────────────────────────────────────

export type CompanyInfo = z.infer<typeof CompanyInfoDTO>;
export type CompanyInfoResponse = z.infer<typeof CompanyInfoResponseDTO>;
export type UpdateCompanyInfoRequest = z.infer<typeof UpdateCompanyInfoRequestDTO>;

export type GeneralSettings = z.infer<typeof GeneralSettingsDTO>;
export type GeneralSettingsResponse = z.infer<typeof GeneralSettingsResponseDTO>;
export type UpdateGeneralSettingsRequest = z.infer<typeof UpdateGeneralSettingsRequestDTO>;

export type AttendanceSettings = z.infer<typeof AttendanceSettingsDTO>;
export type AttendanceSettingsResponse = z.infer<typeof AttendanceSettingsResponseDTO>;
export type UpdateAttendanceSettingsRequest = z.infer<typeof UpdateAttendanceSettingsRequestDTO>;
