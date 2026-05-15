import api from "@/lib/axios/core/instance";
import { apis } from "@/lib/api/config";
import {
  CompanyInfoResponseDTO,
  GeneralSettingsResponseDTO,
  AttendanceSettingsResponseDTO,
  type CompanyInfoResponse,
  type GeneralSettingsResponse,
  type AttendanceSettingsResponse,
  type UpdateCompanyInfoRequest,
  type UpdateGeneralSettingsRequest,
  type UpdateAttendanceSettingsRequest,
} from "../types/company.dto";
import {
  mapCompanyInfoResponseFromDTO,
  mapGeneralSettingsResponseFromDTO,
  mapAttendanceSettingsResponseFromDTO,
} from "../mappers/company.mapper";

export async function getCompanyInfo(): Promise<CompanyInfoResponse> {
  const response = await api.get(apis.company.info);
  const parsed = CompanyInfoResponseDTO.safeParse(response.data);
  if (!parsed.success) {
    console.error("Zod Parse Error (company info):", parsed.error.format());
    throw new Error("Invalid company info data structure received from API");
  }
  return mapCompanyInfoResponseFromDTO(parsed.data);
}

export async function updateCompanyInfo(data: UpdateCompanyInfoRequest): Promise<void> {
  await api.patch(apis.company.info, data);
}

export async function uploadLogo(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("logo", file);
  await api.post(apis.company.logo, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteLogo(): Promise<void> {
  await api.delete(apis.company.logo);
}

export async function getGeneralSettings(): Promise<GeneralSettingsResponse> {
  const response = await api.get(apis.company.settings);
  const parsed = GeneralSettingsResponseDTO.safeParse(response.data);
  if (!parsed.success) {
    console.error("Zod Parse Error (general settings):", parsed.error.format());
    throw new Error("Invalid general settings data structure received from API");
  }
  return mapGeneralSettingsResponseFromDTO(parsed.data);
}

export async function updateGeneralSettings(data: UpdateGeneralSettingsRequest): Promise<void> {
  await api.patch(apis.company.settings, data);
}

export async function getAttendanceSettings(): Promise<AttendanceSettingsResponse> {
  const response = await api.get(apis.company.attendance);
  const parsed = AttendanceSettingsResponseDTO.safeParse(response.data);
  if (!parsed.success) {
    console.error("Zod Parse Error (attendance settings):", parsed.error.format());
    throw new Error("Invalid attendance settings data structure received from API");
  }
  return mapAttendanceSettingsResponseFromDTO(parsed.data);
}

export async function updateAttendanceSettings(data: UpdateAttendanceSettingsRequest): Promise<void> {
  await api.patch(apis.company.attendance, data);
}
