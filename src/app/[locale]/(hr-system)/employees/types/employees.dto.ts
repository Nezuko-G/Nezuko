import { z } from "zod";

export const EmployeeRoleEnum = z.enum([
    "HR_ADMIN",
    "MANAGER",
    "EMPLOYEE",
]);

export const EmployeeStatusEnum = z.enum([
    "ACTIVE",
    "INACTIVE",
    "TERMINATED",
    "ON_LEAVE",
]);

export const GenderEnum = z.enum([
    "MALE",
    "FEMALE",
    "OTHER",
]);

// ─── Shared Meta ────────────────────────────────────────────────────────────

const PaginationMetaDTO = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

// ─── Departments ─────────────────────────────────────────────────────────────

export const DepartmentDTO = z.object({
    id: z.string(),
    tenantId: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    managerId: z.string().nullable(),
    parentId: z.string().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    employeeCount: z.number(),
});

export const GetAllDepartmentsResponseDTO = z.object({
    success: z.literal(true),
    data: z.array(DepartmentDTO),
    meta: PaginationMetaDTO,
});

// ─── Employees ───────────────────────────────────────────────────────────────

const DepartmentSummaryDTO = z.object({
    id: z.string(),
    name: z.string(),
    managerId: z.string().nullable(),
});

const EmployeeSummaryDTO = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    salary: z.number().nullable(),
    role: EmployeeRoleEnum,
    jobTitle: z.string().nullable(),
    employeeCode: z.string().nullable(),
    status: EmployeeStatusEnum,
    gender: GenderEnum.nullable(),
    phone: z.string().nullable(),
    hireDate: z.string().datetime().nullable(),
    departmentId: z.string().nullable(),
    createdAt: z.string().datetime(),
    department: DepartmentSummaryDTO.nullable(),
});

export const GetAllEmployeesResponseDTO = z.object({
    data: z.object({
        employees: z.array(EmployeeSummaryDTO),
        meta: PaginationMetaDTO,
    }),
});

export const GetEmployeeResponseDTO = z.object({
    status: z.literal("success"),
    data: z.object({
        employee: EmployeeSummaryDTO,
    }),
});

export const CreateEmployeeRequestDTO = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    jobTitle: z.string().min(1),
    hireDate: z.string().date(),
    gender: GenderEnum,
    dateOfBirth: z.string().date(),
    phone: z.string().min(1),
});

export const CreateEmployeeResponseDTO = z.object({
    status: z.literal("success"),
    data: z.object({
        employee: EmployeeSummaryDTO,
    }),
});

export const UpdateEmployeeRequestDTO = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    jobTitle: z.string().min(1).optional(),
    phone: z.string().optional(),
    gender: GenderEnum.optional(),
    dateOfBirth: z.string().date().optional(),
    hireDate: z.string().date().optional(),
    country: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    emergencyName: z.string().optional(),
    emergencyPhone: z.string().optional(),
    emergencyRelation: z.string().optional(),
});

export const UpdateEmployeeResponseDTO = z.object({
    status: z.literal("success"),
    data: z.object({
        employee: EmployeeSummaryDTO,
    }),
});

export const DeleteEmployeeResponseDTO = z.object({
    status: z.literal("success"),
    data: z.object({
        message: z.string(),
    }),
});


export type Department = z.infer<typeof DepartmentDTO>;
export type GetAllDepartmentsResponse = z.infer<typeof GetAllDepartmentsResponseDTO>;

export type EmployeeSummary = z.infer<typeof EmployeeSummaryDTO>;
export type GetAllEmployeesResponse = z.infer<typeof GetAllEmployeesResponseDTO>;
export type GetEmployeeResponse = z.infer<typeof GetEmployeeResponseDTO>;

export type CreateEmployeeRequest = z.infer<typeof CreateEmployeeRequestDTO>;
export type CreateEmployeeResponse = z.infer<typeof CreateEmployeeResponseDTO>;

export type UpdateEmployeeRequest = z.infer<typeof UpdateEmployeeRequestDTO>;
export type UpdateEmployeeResponse = z.infer<typeof UpdateEmployeeResponseDTO>;

export type DeleteEmployeeResponse = z.infer<typeof DeleteEmployeeResponseDTO>;