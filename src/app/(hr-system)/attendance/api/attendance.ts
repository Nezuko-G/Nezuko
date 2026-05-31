import api from "@/lib/axios/core/instance";
import { apis } from "@/lib/api/config";
import { TimesheetDTO, type Timesheet } from "@/app/(hr-system)/attendance/types/timesheet.dto";
import { mapTimesheetsFromDTO } from "@/app/(hr-system)/attendance/mappers/timesheet.mapper";
import {
  MarkAttendanceErrorDTO,
  MarkAttendanceResponseDTO,
} from "@/app/(hr-system)/attendance/types/attendance.dto";
import {
  mapMarkAttendanceFromDTO,
  type MarkAttendanceResult,
} from "@/app/(hr-system)/attendance/mappers/attendance.mapper";

type ApiResponse = {
  data: unknown;
  error: string | null;
  status: number | string;
  all?: unknown;
};

export interface TimesheetFilters {
  userId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AttendanceError {
  code: "OUTSIDE_GEOFENCE" | "FEATURE_DISABLED" | "ALREADY_RECORDED";
  message: string;
  distance?: number;
  maxDistance?: number;
}

export async function markAttendance(
  lat: number,
  lng: number
): Promise<MarkAttendanceResult> {
  const response = (await api.post(apis.attendance.mark, { lat, lng })) as ApiResponse;

  if (response.error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorData = (response.all as any)?.response?.data;
    const parsedError = MarkAttendanceErrorDTO.safeParse(errorData);
    if (parsedError.success) {
      const err: AttendanceError = {
        code: parsedError.data.code,
        message: String(response.error),
        distance: parsedError.data.data?.distance,
        maxDistance: parsedError.data.data?.maxDistance,
      };
      throw err;
    }
    throw new Error(String(response.error));
  }

  const parsed = MarkAttendanceResponseDTO.safeParse(response.data);
  if (!parsed.success) {
    throw new Error("Invalid attendance response from server");
  }

  return mapMarkAttendanceFromDTO(parsed.data);
}

export async function getMyTimesheets(filters?: TimesheetFilters): Promise<Timesheet[]> {
  const response = (await api.get(apis.attendance.me, { params: filters })) as ApiResponse;

  if (response.error) {
    throw new Error(String(response.error));
  }

  const parsed = TimesheetDTO.array().safeParse(response.data);
  if (!parsed.success) {
    throw new Error("Invalid timesheet data structure received from API");
  }

  return mapTimesheetsFromDTO(parsed.data);
}
