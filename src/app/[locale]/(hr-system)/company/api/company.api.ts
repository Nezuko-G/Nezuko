import { getRequest, patchRequest, postRequest, deleteRequest } from "@/lib/axios/dist/requests";
import { apis } from "@/lib/api/config";
import { throwIfError } from "@/lib/api/utils";
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
  const response = await getRequest<any>({ api: apis.company.info });
  throwIfError(response);
  const parsed = CompanyInfoResponseDTO.safeParse(response.data);
  if (!parsed.success) {
    console.error("Zod Parse Error (company info):", parsed.error.format());
    throw new Error("Invalid company info data structure received from API");
  }
  return mapCompanyInfoResponseFromDTO(parsed.data);
}

export async function updateCompanyInfo(data: UpdateCompanyInfoRequest): Promise<void> {
  const res = await patchRequest<any>({ api: apis.company.info, body: data });
  throwIfError(res);
}

export async function uploadLogo(file: File): Promise<void> {
  const formData = new FormData();
  formData.append("logo", file);
  const res = await postRequest<any>({
    api: apis.company.logo,
    body: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  });
  throwIfError(res);
}

export async function deleteLogo(): Promise<void> {
  const res = await deleteRequest<any>({ api: apis.company.logo });
  throwIfError(res);
}

export async function getGeneralSettings(): Promise<GeneralSettingsResponse> {
  const response = await getRequest<any>({ api: apis.company.settings });
  throwIfError(response);
  const parsed = GeneralSettingsResponseDTO.safeParse(response.data);
  if (!parsed.success) {
    console.error("Zod Parse Error (general settings):", parsed.error.format());
    throw new Error("Invalid general settings data structure received from API");
  }
  return mapGeneralSettingsResponseFromDTO(parsed.data);
}

export async function updateGeneralSettings(data: UpdateGeneralSettingsRequest): Promise<void> {
  const res = await patchRequest<any>({ api: apis.company.settings, body: data });
  throwIfError(res);
}

export async function getAttendanceSettings(): Promise<AttendanceSettingsResponse> {
  const response = await getRequest<any>({ api: apis.company.attendance });
  throwIfError(response);
  const parsed = AttendanceSettingsResponseDTO.safeParse(response.data);
  if (!parsed.success) {
    console.error("Zod Parse Error (attendance settings):", parsed.error.format());
    throw new Error("Invalid attendance settings data structure received from API");
  }
  return mapAttendanceSettingsResponseFromDTO(parsed.data);
}

export async function updateAttendanceSettings(data: UpdateAttendanceSettingsRequest): Promise<void> {
  const res = await patchRequest<any>({ api: apis.company.attendance, body: data });
  throwIfError(res);
}
