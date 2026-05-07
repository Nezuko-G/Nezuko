import {
  LeaveRequest,
  CreateLeaveRequestInput,
  ReviewLeaveRequestInput,
  LeaveRequestListResponse,
} from "@/types/dto/leave.dto";

const mockRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "user-1",
    employeeName: "Ahmed Ali",
    type: "ANNUAL",
    startDate: "2026-02-15",
    endDate: "2026-02-20",
    status: "APPROVED",
    reason: "Family vacation",
    reviewNote: "Approved",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-01-21T14:30:00Z",
  },
  {
    id: "2",
    employeeId: "user-1",
    employeeName: "Ahmed Ali",
    type: "SICK",
    startDate: "2026-01-10",
    endDate: "2026-01-11",
    status: "APPROVED",
    reason: "Not feeling well",
    reviewNote: "Get well soon",
    createdAt: "2026-01-09T08:00:00Z",
    updatedAt: "2026-01-09T09:00:00Z",
  },
  {
    id: "3",
    employeeId: "user-2",
    employeeName: "Sarah Mohammed",
    type: "ANNUAL",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    status: "PENDING",
    reason: "Personal leave",
    createdAt: "2026-02-01T11:00:00Z",
    updatedAt: "2026-02-01T11:00:00Z",
  },
  {
    id: "4",
    employeeId: "user-2",
    employeeName: "Sarah Mohammed",
    type: "OFFICIAL",
    startDate: "2026-02-20",
    endDate: "2026-02-20",
    status: "REJECTED",
    reason: "Important meeting",
    reviewNote: "Team meeting on that day",
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-16T10:00:00Z",
  },
];

let requests = [...mockRequests];

export const mockCreateLeaveRequest = async (
  data: CreateLeaveRequestInput
): Promise<LeaveRequest> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newRequest: LeaveRequest = {
    id: String(requests.length + 1),
    employeeId: "current-user",
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    status: "PENDING",
    reason: data.reason,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  requests = [newRequest, ...requests];
  return newRequest;
};

export const mockGetLeaveRequests = async (_params?: {
  page?: string;
  limit?: string;
}): Promise<LeaveRequestListResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const page = 1;
  const limit = 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: requests.slice(start, end),
    pagination: {
      page,
      limit,
      total: requests.length,
      totalPages: Math.ceil(requests.length / limit),
    },
  };
};

export const mockGetMyLeaveRequests = async (): Promise<LeaveRequest[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return requests.filter((r) => r.employeeId === "current-user");
};

export const mockReviewLeaveRequest = async (
  id: string,
  data: ReviewLeaveRequestInput
): Promise<LeaveRequest> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const request = requests.find((r) => r.id === id);
  if (!request) {
    throw new Error("Request not found");
  }

  request.status = data.status;
  request.reviewNote = data.reviewNote;
  request.updatedAt = new Date().toISOString();

  return request;
};

export const mockCancelLeaveRequest = async (
  id: string
): Promise<LeaveRequest> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const request = requests.find((r) => r.id === id);
  if (!request) {
    throw new Error("Request not found");
  }

  request.status = "CANCELLED";
  request.updatedAt = new Date().toISOString();

  return request;
};