/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequest, postRequest, patchRequest } from "@/lib/axios/dist/requests";
import { throwIfError, extractList } from "@/lib/api/utils";
import type {
  Timesheet,
  SubmitTimesheetInput,
  EditTimesheetInput,
  ReviewTimesheetInput,
  OvertimeReport,
} from "@/app/(hr-system)/timesheets/types/timesheet.dto";
import {
  mapTimesheetsFromDTO,
  mapTimesheetFromDTO,
  mapOvertimeReportFromDTO,
} from "@/app/(hr-system)/timesheets/mappers/timesheet.mapper";
import { apis } from "@/lib/api/config";

export interface TimesheetListFilters {
  userId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export async function getTimesheets(filters?: TimesheetListFilters): Promise<Timesheet[]> {
  const response = await getRequest<any>({
    api: apis.timesheets.base,
    config: { params: filters },
  });

  throwIfError(response);

  const raw = extractList(response);
  return mapTimesheetsFromDTO(raw);
}

export async function getMyTimesheets(): Promise<Timesheet[]> {
  const response = await getRequest<any>({
    api: apis.timesheets.me,
  });

  throwIfError(response);

  const raw = extractList(response);
  return mapTimesheetsFromDTO(raw);
}

export async function submitTimesheet(data: SubmitTimesheetInput) {
  const response = await postRequest<any>({
    api: apis.timesheets.base,
    body: data,
  });

  throwIfError(response);

  return mapTimesheetFromDTO(response.data);
}

export async function editTimesheet(id: string, data: EditTimesheetInput) {
  const response = await patchRequest<any>({
    api: apis.timesheets.byId(id),
    body: data,
  });

  throwIfError(response);

  return mapTimesheetFromDTO(response.data);
}

export async function reviewTimesheet(id: string, data: ReviewTimesheetInput) {
  const response = await patchRequest<any>({
    api: apis.timesheets.status(id),
    body: data,
  });

  throwIfError(response);

  return mapTimesheetFromDTO(response.data);
}

export interface OvertimeReportFilters {
  startDate: string;
  endDate: string;
  departmentId?: string;
  page?: number;
  limit?: number;
}

export async function getOvertimeReport(filters: OvertimeReportFilters): Promise<OvertimeReport> {
  const response = await getRequest<any>({
    api: apis.timesheets.overtime,
    config: { params: filters },
  });

  throwIfError(response);

  const data = response.data?.data ?? response.data ?? {};
  const raw = Array.isArray(data) ? data : (data.timesheets ?? data.items ?? []);
  const meta = data.meta ?? null;
  return mapOvertimeReportFromDTO(raw, meta);
}
