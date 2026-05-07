import { apiClient } from "../axios";
import { apis } from "../config";
import {
  LeaveRequest,
  CreateLeaveRequestInput,
  ReviewLeaveRequestInput,
  LeaveRequestListResponse,
} from "@/types/dto/leave.dto";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const getApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url = endpoint;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }
  return url;
};

export const createLeaveRequest = async (
  data: CreateLeaveRequestInput
): Promise<LeaveRequest> => {
  if (USE_MOCK) {
    const { mockCreateLeaveRequest } = await import("../mock/leave-mock");
    return mockCreateLeaveRequest(data);
  }

  const response = await apiClient.post(apis.leave.create, data);
  return response.data;
};

export const getLeaveRequests = async (
  params?: { page?: string; limit?: string }
): Promise<LeaveRequestListResponse> => {
  if (USE_MOCK) {
    const { mockGetLeaveRequests } = await import("../mock/leave-mock");
    return mockGetLeaveRequests(params);
  }

  const response = await apiClient.get(apis.leave.getAll, { params });
  return response.data;
};

export const getMyLeaveRequests = async (): Promise<LeaveRequest[]> => {
  if (USE_MOCK) {
    const { mockGetMyLeaveRequests } = await import("../mock/leave-mock");
    return mockGetMyLeaveRequests();
  }

  const response = await apiClient.get(apis.leave.getMe);
  return response.data;
};

export const reviewLeaveRequest = async (
  id: string,
  data: ReviewLeaveRequestInput
): Promise<LeaveRequest> => {
  if (USE_MOCK) {
    const { mockReviewLeaveRequest } = await import("../mock/leave-mock");
    return mockReviewLeaveRequest(id, data);
  }

  const response = await apiClient.patch(
    getApiUrl(apis.leave.review, { id }),
    data
  );
  return response.data;
};

export const cancelLeaveRequest = async (
  id: string
): Promise<LeaveRequest> => {
  if (USE_MOCK) {
    const { mockCancelLeaveRequest } = await import("../mock/leave-mock");
    return mockCancelLeaveRequest(id);
  }

  const response = await apiClient.patch(getApiUrl(apis.leave.cancel, { id }));
  return response.data;
};