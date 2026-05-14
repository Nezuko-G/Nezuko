import { z } from "zod";
import apiClient from "@/lib/axios/core/instance";
import { apis } from "../config";
import { DepartmentDTO, CreateDepartmentDTO, UpdateDepartmentDTO } from "@/types/dto/department.dto";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

export async function getDepartments(params?: { page?: number; limit?: number; search?: string; parentId?: string }) {
  const response = await apiClient.get<ApiResponse<z.infer<typeof DepartmentDTO>[]>>(apis.departments.base, { params });
  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

export async function getDepartment(id: string) {
  const response = await apiClient.get<ApiResponse<z.infer<typeof DepartmentDTO>>>(apis.departments.byId(id));
  return response.data.data;
}

export async function createDepartment(data: z.infer<typeof CreateDepartmentDTO>) {
  const validated = CreateDepartmentDTO.parse(data);
  const response = await apiClient.post<ApiResponse<z.infer<typeof DepartmentDTO>>>(apis.departments.base, validated);
  return response.data.data;
}

export async function updateDepartment({ id, data }: { id: string; data: z.infer<typeof UpdateDepartmentDTO> }) {
  const validated = UpdateDepartmentDTO.parse(data);
  const response = await apiClient.patch<ApiResponse<z.infer<typeof DepartmentDTO>>>(apis.departments.byId(id), validated);
  return response.data.data;
}

export async function deleteDepartment(id: string) {
  const response = await apiClient.delete<ApiResponse<any>>(apis.departments.byId(id));
  return response.data;
}