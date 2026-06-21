import {
    GetAllEmployeesResponseDTO,
    CreateEmployeeResponseDTO,
    UpdateEmployeeResponseDTO,
    DeleteEmployeeResponseDTO,
    GetEmployeeResponseDTO,
    type CreateEmployeeRequest,
    type UpdateEmployeeRequest,
} from "@/app/(hr-system)/employees/types/employees.dto";
import {
    mapGetAllEmployeesFromDTO,
    mapGetEmployeeFromDTO,
    mapCreateEmployeeFromDTO,
    mapUpdateEmployeeFromDTO,
    mapDeleteEmployeeFromDTO,
} from "@/app/(hr-system)/employees/mappers/employees.mapper";
import { apis } from "@/lib/api/config";
import api from "@/lib/axios/core/instance";
import type {
    GetAllEmployeesResponse,
    GetEmployeeResponse,
    CreateEmployeeResponse,
    UpdateEmployeeResponse,
    DeleteEmployeeResponse,
} from "@/app/(hr-system)/employees/types/employees.dto";

export async function getAllEmployees(params?: {
    page?: number;
    limit?: number;
    search?: string;
    departmentId?: string;
    status?: string;
}): Promise<GetAllEmployeesResponse> {
    const response = await api.get(apis.employees.base, { params });

    const parsed = GetAllEmployeesResponseDTO.safeParse(response.data);

    if (!parsed.success) {
        throw new Error("Invalid employees data structure received from API");
    }

    return mapGetAllEmployeesFromDTO(parsed.data);
}

export async function getEmployee(id: string): Promise<GetEmployeeResponse> {
    const response = await api.get(apis.employees.byId(id));

    const parsed = GetEmployeeResponseDTO.safeParse(response.data);

    if (!parsed.success) {
        throw new Error("Invalid employee data structure received from API");
    }

    return mapGetEmployeeFromDTO(parsed.data);
}

export async function createEmployee(data: CreateEmployeeRequest): Promise<CreateEmployeeResponse> {
    const response = await api.post(apis.employees.base, data);

    const parsed = CreateEmployeeResponseDTO.safeParse(response.data);

    if (!parsed.success) {
        throw new Error("Invalid employee data structure received from API");
    }

    return mapCreateEmployeeFromDTO(parsed.data);
}

export async function updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<void> {
    await api.patch(apis.employees.byId(id), data);
}

export async function deleteEmployee(id: string): Promise<DeleteEmployeeResponse> {
    const response = await api.delete(apis.employees.byId(id));

    const parsed = DeleteEmployeeResponseDTO.safeParse(response.data);

    if (!parsed.success) {
        throw new Error("Invalid employee data structure received from API");
    }

    return mapDeleteEmployeeFromDTO(parsed.data);
}