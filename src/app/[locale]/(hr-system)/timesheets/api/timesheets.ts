import { getRequest, postRequest, patchRequest } from "@/lib/axios/dist/requests";
import type {
  Timesheet,
  SubmitTimesheetInput,
  EditTimesheetInput,
  ReviewTimesheetInput,
  OvertimeReport,
  OvertimeReportItem,
} from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";
import { mapTimesheetsFromDTO, mapTimesheetFromDTO } from "@/app/[locale]/(hr-system)/timesheets/mappers/timesheet.mapper";
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

  if (response.error) {
    const error = new Error(String(response.error));
    (error as any).status = response.status;
    throw error;
  }

  const data = response.data?.data ?? response.data ?? [];
  const raw = Array.isArray(data) ? data : data.timesheets ?? [];
  return mapTimesheetsFromDTO(raw);
}

export async function getMyTimesheets(): Promise<Timesheet[]> {
  const response = await getRequest<any>({
    api: apis.timesheets.me,
  });

  if (response.error) {
    const error = new Error(String(response.error));
    (error as any).status = response.status;
    throw error;
  }

  const data = response.data?.data ?? response.data ?? [];
  const raw = Array.isArray(data) ? data : data.timesheets ?? [];
  return mapTimesheetsFromDTO(raw);
}

export async function submitTimesheet(data: SubmitTimesheetInput) {
  const response = await postRequest<any>({
    api: apis.timesheets.base,
    body: data,
  });

  if (response.error) {
    const error = new Error(String(response.error));
    (error as any).status = response.status;
    throw error;
  }
  return mapTimesheetFromDTO(response.data);
}

export async function editTimesheet(id: string, data: EditTimesheetInput) {
  const response = await patchRequest<any>({
    api: apis.timesheets.byId(id),
    body: data,
  });

  if (response.error) {
    const error = new Error(String(response.error));
    (error as any).status = response.status;
    throw error;
  }
  return mapTimesheetFromDTO(response.data);
}

export async function reviewTimesheet(id: string, data: ReviewTimesheetInput) {
  const response = await patchRequest<any>({
    api: apis.timesheets.status(id),
    body: data,
  });

  if (response.error) {
    const error = new Error(String(response.error));
    (error as any).status = response.status;
    throw error;
  }
  return mapTimesheetFromDTO(response.data);
}

export interface OvertimeReportFilters {
  startDate: string;
  endDate: string;
  departmentId?: string;
}

export async function getOvertimeReport(filters: OvertimeReportFilters): Promise<OvertimeReport> {
  const response = await getRequest<any>({
    api: apis.timesheets.overtime,
    config: { params: filters },
  });

  if (response.error) {
    const error = new Error(String(response.error));
    (error as any).status = response.status;
    throw error;
  }

  const rawTimesheets: any[] = response.data?.data?.timesheets ?? [];
  const items: OvertimeReportItem[] = rawTimesheets.map((ts) => ({
    userId: ts.userId,
    employeeName: ts.user ? `${ts.user.firstName} ${ts.user.lastName}` : "Unknown",
    departmentId: ts.user?.departmentId ?? null,
    departmentName: null,
    date: ts.date,
    totalHours: ts.totalHours,
    overtimeHours: ts.overtimeHours,
  }));

  const totalOvertime = items.reduce((sum, item) => sum + item.overtimeHours, 0);

  return { items, totalOvertime };
}
