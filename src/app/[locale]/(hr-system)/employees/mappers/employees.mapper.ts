import type {
    GetAllEmployeesResponse,
    GetEmployeeResponse,
    CreateEmployeeResponse,
    UpdateEmployeeResponse,
    DeleteEmployeeResponse,
    EmployeeSummary,
} from "../types/employees.dto";
import {
    GetAllEmployeesResponseDTO,
    GetEmployeeResponseDTO,
    CreateEmployeeResponseDTO,
    UpdateEmployeeResponseDTO,
    DeleteEmployeeResponseDTO,
} from "../types/employees.dto";
import type { z } from "zod";


type GetAllEmployeesResponseDTOType = z.infer<typeof GetAllEmployeesResponseDTO>;
type GetEmployeeResponseDTOType = z.infer<typeof GetEmployeeResponseDTO>;
type CreateEmployeeResponseDTOType = z.infer<typeof CreateEmployeeResponseDTO>;
type UpdateEmployeeResponseDTOType = z.infer<typeof UpdateEmployeeResponseDTO>;
type DeleteEmployeeResponseDTOType = z.infer<typeof DeleteEmployeeResponseDTO>;

type EmployeeSummaryDTOType = GetAllEmployeesResponseDTOType["data"]["employees"][number];



function mapEmployeeFromDTO(dto: EmployeeSummaryDTOType): EmployeeSummary {
    return {
        id: dto.id,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        salary: dto.salary,
        role: dto.role,
        jobTitle: dto.jobTitle,
        employeeCode: dto.employeeCode,
        status: dto.status,
        gender: dto.gender,
        phone: dto.phone,
        hireDate: dto.hireDate,
        departmentId: dto.departmentId,
        createdAt: dto.createdAt,
        department: dto.department ?? null,
    };
}



export function mapGetAllEmployeesFromDTO(
    dto: GetAllEmployeesResponseDTOType
): GetAllEmployeesResponse {
    return {
        data: {
            employees: dto.data.employees.map(mapEmployeeFromDTO),
            meta: dto.data.meta,
        },
    };
}
export function mapGetEmployeeFromDTO(
    dto: GetEmployeeResponseDTOType
): GetEmployeeResponse {
    return {
        status: dto.status,
        data: {
            employee: mapEmployeeFromDTO(dto.data.employee),
        },
    };
}

export function mapCreateEmployeeFromDTO(
    dto: CreateEmployeeResponseDTOType
): CreateEmployeeResponse {
    return {
        status: dto.status,
        data: {
            employee: mapEmployeeFromDTO(dto.data.employee),
        },
    };
}

export function mapUpdateEmployeeFromDTO(
    dto: UpdateEmployeeResponseDTOType
): UpdateEmployeeResponse {
    return {
        status: dto.status,
        data: {
            employee: mapEmployeeFromDTO(dto.data.employee),
        },
    };
}

export function mapDeleteEmployeeFromDTO(
    dto: DeleteEmployeeResponseDTOType
): DeleteEmployeeResponse {
    return {
        status: dto.status,
        data: {
            message: dto.data.message,
        },
    };
}