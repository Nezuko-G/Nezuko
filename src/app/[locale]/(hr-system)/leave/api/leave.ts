import { z } from "zod";
import { LeaveRequestDTO, CreateLeaveRequestDTO, ReviewLeaveRequestDTO } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";
import { mapLeaveRequestFromDTO, mapLeaveRequestsFromDTO } from "@/app/[locale]/(hr-system)/leave/mappers/leave.mapper";
import { apis } from "@/lib/api/config";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = typeof data?.message === 'string' ? data.message : `Request failed with status ${response.status}`;
      return { data: null, error: errorMessage, status: response.status };
    }

    return { data, error: null, status: response.status };
  } catch (err: any) {
    if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
      return { data: null, error: 'Request canceled', status: 0 };
    }
    if (err.name === 'TypeError' && err.message.includes('network')) {
      return { data: null, error: 'Connection timeout. Please try again.', status: 0 };
    }
    return { data: null, error: err.message || 'An error occurred', status: 0 };
  }
}

export async function createLeaveRequest(data: CreateLeaveInput) {
  const validated = CreateLeaveRequestDTO.parse(data);
  const response = await apiRequest<z.infer<typeof LeaveRequestDTO>>(apis.leaveRequests.base, {
    method: 'POST',
    body: JSON.stringify(validated),
  });
  
  if (response.error) throw new Error(response.error);
  if (!response.data) throw new Error("No data received");
  return mapLeaveRequestFromDTO(response.data);
}

export async function getAllLeaveRequests(params?: { limit?: number; page?: number }) {
  const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const response = await apiRequest<any>(`${apis.leaveRequests.base}${queryString}`);
  
  if (response.error) throw new Error(response.error);
  if (!response.data) return [];
  
  const data = response.data.data?.leaveRequests ?? response.data.leaveRequests ?? [];
  const parsed = LeaveRequestDTO.array().safeParse(data);
  if (!parsed.success) {
    console.error("[getAllLeaveRequests] Parse failure:", parsed.error);
    throw new Error("Failed to parse leave requests data");
  }
  
  return mapLeaveRequestsFromDTO(parsed.data);
}

export async function getMyLeaveRequests(params?: { limit?: number; page?: number }) {
  const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
  const response = await apiRequest<z.infer<typeof LeaveRequestDTO>[]>(`${apis.leaveRequests.me}${queryString}`);
  
  if (response.error) throw new Error(response.error);
  if (!response.data) return [];
  return mapLeaveRequestsFromDTO(response.data);
}

export async function reviewLeaveRequest(id: string, data: ReviewLeaveInput) {
  const validated = ReviewLeaveRequestDTO.parse(data);
  const response = await apiRequest<z.infer<typeof LeaveRequestDTO>>(apis.leaveRequests.review(id), {
    method: 'PATCH',
    body: JSON.stringify(validated),
  });
  
  if (response.error) throw new Error(response.error);
  if (!response.data) throw new Error("No data received");
  return mapLeaveRequestFromDTO(response.data);
}

export async function cancelLeaveRequest(id: string) {
  const response = await apiRequest(apis.leaveRequests.cancel(id), {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
  
  if (response.error) throw new Error(response.error);
  return response.data;
}

type CreateLeaveInput = z.infer<typeof CreateLeaveRequestDTO>;
type ReviewLeaveInput = z.infer<typeof ReviewLeaveRequestDTO>;