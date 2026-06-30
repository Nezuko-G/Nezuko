import { z } from "zod";
import apiClient from "@/lib/axios/core/instance";
import { apis } from "@/lib/api/config";
import { ReportTypeDTO, ReportPreviewDTO, ReportHistoryItemDTO } from "../types/report.dto";

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export async function getReportTypes() {
  const response = await apiClient.get<ApiResponse<z.infer<typeof ReportTypeDTO>[]>>(apis.reports.types);
  return response.data.data;
}

export async function getReportPreview(type: string, params?: Record<string, any>) {
  const response = await apiClient.get<ApiResponse<z.infer<typeof ReportPreviewDTO>>>(apis.reports.preview(type), { params });
  return response.data.data;
}

export async function downloadReportCsv(type: string, params?: Record<string, any>) {
  const response = await apiClient.get(apis.reports.exportCsv(type), {
    params,
    responseType: "blob",
  });
  return response.data;
}

export async function downloadReportPdf(type: string, params?: Record<string, any>) {
  const response = await apiClient.get(apis.reports.exportPdf(type), {
    params,
    responseType: "blob",
  });
  return response.data;
}

export async function getReportHistory() {
  const response = await apiClient.get<ApiResponse<z.infer<typeof ReportHistoryItemDTO>[]>>(apis.reports.history);
  return response.data.data;
}
