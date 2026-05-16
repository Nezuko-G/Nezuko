import { z } from "zod";
import apiClient from "@/lib/axios/core/instance";
import { apis } from "../config";
import { 
  InsurancePlanDTO, CreateInsurancePlanDTO, UpdateInsurancePlanDTO, 
  InsuranceEnrollmentDTO, EnrollEmployeeDTO, 
  CoverageReportItemDTO, CostPreviewDTO, CreateDependentDTO 
} from "@/types/dto/insurance.dto";

interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: any;
}

export async function getInsurancePlans(params?: { page?: number; limit?: number; type?: string; isActive?: boolean }) {
  const response = await apiClient.get<ApiResponse<any>>(apis.insurance.plans, { params });
  return {
    data: response.data.data?.plans || response.data.data || [],
    meta: response.data.meta || response.data.data?.meta || { totalPages: 1 },
  };
}

export async function createInsurancePlan(data: z.infer<typeof CreateInsurancePlanDTO>) {
  const validated = CreateInsurancePlanDTO.parse(data);
  const response = await apiClient.post<ApiResponse<z.infer<typeof InsurancePlanDTO>>>(apis.insurance.plans, validated);
  return response.data.data;
}

export async function updateInsurancePlan({ id, data }: { id: string; data: z.infer<typeof UpdateInsurancePlanDTO> }) {
  const validated = UpdateInsurancePlanDTO.parse(data);
  const response = await apiClient.patch<ApiResponse<z.infer<typeof InsurancePlanDTO>>>(apis.insurance.planById(id), validated);
  return response.data.data;
}

export async function deleteInsurancePlan(id: string) {
  const response = await apiClient.delete<ApiResponse<any>>(apis.insurance.planById(id));
  return response.data;
}

export async function enrollEmployee({ planId, data }: { planId: string; data: z.infer<typeof EnrollEmployeeDTO> }) {
  const validated = EnrollEmployeeDTO.parse(data);
  const response = await apiClient.post<ApiResponse<z.infer<typeof InsuranceEnrollmentDTO>>>(apis.insurance.enroll(planId), validated);
  return response.data.data;
}

export async function getCoverageReport() {
  const response = await apiClient.get<ApiResponse<z.infer<typeof CoverageReportItemDTO>[]>>(apis.insurance.coverageReport);
  return response.data.data;
}

export async function getMyInsurance() {
  const response = await apiClient.get<ApiResponse<z.infer<typeof InsuranceEnrollmentDTO>>>(apis.insurance.enrollments.me);
  return response.data.data;
}

export async function getCostPreview(planId: string, userId: string) {
  const response = await apiClient.get<ApiResponse<z.infer<typeof CostPreviewDTO>>>(apis.insurance.enrollments.costPreview(planId), { params: { userId } });
  return response.data.data;
}

export async function addDependent({ enrollmentId, data }: { enrollmentId: string; data: z.infer<typeof CreateDependentDTO> }) {
  const validated = CreateDependentDTO.parse(data);
  const response = await apiClient.post<ApiResponse<any>>(apis.insurance.enrollments.dependents(enrollmentId), validated);
  return response.data;
}

export async function removeDependent({ enrollmentId, depId }: { enrollmentId: string; depId: string }) {
  const response = await apiClient.delete<ApiResponse<any>>(apis.insurance.enrollments.dependentById(enrollmentId, depId));
  return response.data;
}