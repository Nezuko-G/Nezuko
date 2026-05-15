import { TimesheetDTO, type Timesheet } from "@/app/[locale]/(hr-system)/attendance/types/timesheet.dto";
import { mapTimesheetsFromDTO } from "@/app/[locale]/(hr-system)/attendance/mappers/timesheet.mapper";
import { apis } from "@/lib/api/config";
import api from "@/lib/axios/core/instance";

export interface TimesheetFilters {
  userId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getTimesheets(filters?: TimesheetFilters): Promise<Timesheet[]> {
  const response = await api.get(apis.attendance.timesheets, { params: filters });

  const parsed = TimesheetDTO.array().safeParse(response.data);

  if (!parsed.success) {
    console.error("Zod Parsing Error:", parsed.error.format());
    throw new Error("Invalid timesheet data structure received from API");
  }

  return mapTimesheetsFromDTO(parsed.data);
}
