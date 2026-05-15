import type { z } from "zod";
import type {
  CompanyInfo,
  CompanyInfoResponse,
  GeneralSettings,
  GeneralSettingsResponse,
  AttendanceSettings,
  AttendanceSettingsResponse,
} from "../types/company.dto";
import {
  CompanyInfoResponseDTO,
  GeneralSettingsResponseDTO,
  AttendanceSettingsResponseDTO,
} from "../types/company.dto";

type CompanyInfoResponseDTOType = z.infer<typeof CompanyInfoResponseDTO>;
type GeneralSettingsResponseDTOType = z.infer<typeof GeneralSettingsResponseDTO>;
type AttendanceSettingsResponseDTOType = z.infer<typeof AttendanceSettingsResponseDTO>;

function mapCompanyInfoFromDTO(dto: CompanyInfoResponseDTOType["data"]): CompanyInfo {
  return { ...dto };
}

function mapGeneralSettingsFromDTO(dto: GeneralSettingsResponseDTOType["data"]): GeneralSettings {
  return { ...dto };
}

function mapAttendanceSettingsFromDTO(dto: AttendanceSettingsResponseDTOType["data"]): AttendanceSettings {
  return { ...dto };
}

export function mapCompanyInfoResponseFromDTO(dto: CompanyInfoResponseDTOType): CompanyInfoResponse {
  return {
    status: dto.status,
    data: mapCompanyInfoFromDTO(dto.data),
  };
}

export function mapGeneralSettingsResponseFromDTO(dto: GeneralSettingsResponseDTOType): GeneralSettingsResponse {
  return {
    status: dto.status,
    data: mapGeneralSettingsFromDTO(dto.data),
  };
}

export function mapAttendanceSettingsResponseFromDTO(dto: AttendanceSettingsResponseDTOType): AttendanceSettingsResponse {
  return {
    status: dto.status,
    data: mapAttendanceSettingsFromDTO(dto.data),
  };
}
