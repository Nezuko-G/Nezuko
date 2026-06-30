import { z } from "zod";

export const InsurancePlanTypeEnum = z.enum(["BASIC", "STANDARD", "PREMIUM"]);

export const InsurancePlanDTO = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  type: InsurancePlanTypeEnum,
  coverageDetails: z.string().nullable().optional(),
  salaryPercentage: z.number(),
  maxDependents: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type InsurancePlan = z.infer<typeof InsurancePlanDTO>;

export const CreateInsurancePlanDTO = z.object({
  name: z.string().min(1),
  type: InsurancePlanTypeEnum,
  coverageDetails: z.string().optional(),
  salaryPercentage: z.number().min(0.01).max(100),
  maxDependents: z.number().min(0),
});

export const UpdateInsurancePlanDTO = CreateInsurancePlanDTO.partial();

export const DependentRelationEnum = z.enum(["SPOUSE", "CHILD", "PARENT"]);

export const DependentDTO = z.object({
  id: z.string(),
  tenantId: z.string(),
  enrollmentId: z.string(),
  name: z.string(),
  relation: DependentRelationEnum,
  dateOfBirth: z.string().optional(),
  nationalId: z.string().optional(),
  createdAt: z.string().optional(),
});
export type Dependent = z.infer<typeof DependentDTO>;

export const CreateDependentDTO = z.object({
  name: z.string().min(1),
  relation: DependentRelationEnum,
  dateOfBirth: z.string(),
  nationalId: z.string().min(1),
});

export const InsuranceEnrollmentDTO = z.object({
  id: z.string(),
  tenantId: z.string(),
  userId: z.string(),
  planId: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  monthlyCost: z.number(),
  salaryAtEnrollment: z.number(),
  isActive: z.boolean(),
  createdAt: z.string().optional(),
  plan: InsurancePlanDTO.optional(),
  dependents: z.array(DependentDTO).optional(),
});
export type InsuranceEnrollment = z.infer<typeof InsuranceEnrollmentDTO>;

export const EnrollEmployeeDTO = z.object({
  userId: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
});

export const CoverageReportItemDTO = z.object({
  planId: z.string(),
  planName: z.string(),
  type: InsurancePlanTypeEnum,
  isActive: z.boolean(),
  activeEnrollments: z.number(),
  totalMonthlyCost: z.number(),
});
export type CoverageReportItem = z.infer<typeof CoverageReportItemDTO>;

export const CostPreviewDTO = z.object({
  planId: z.string(),
  userId: z.string(),
  salary: z.number(),
  salaryPercentage: z.number(),
  monthlyCost: z.number(),
});
export type CostPreview = z.infer<typeof CostPreviewDTO>;
