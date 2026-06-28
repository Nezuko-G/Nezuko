import apiClient from "@/lib/axios/core/instance";
import { apis } from "../../../../lib/api/config";

interface ApiResponse<T> {
  status: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isSeen: boolean;
  seenAt: string | null;
  actionUrl: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
}

export async function getNotifications(params?: {
  page?: number;
  limit?: number;
  isSeen?: boolean;
}) {
  const response = await apiClient.get<ApiResponse<{ notifications: NotificationItem[] }>>(
    apis.notifications.base,
    { params },
  );
  return {
    data: response.data.data.notifications || [],
    meta: response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 },
  };
}

export async function getUnreadCount() {
  const response = await apiClient.get<ApiResponse<{ count: number }>>(
    apis.notifications.unreadCount,
  );
  return response.data.data.count;
}

export async function markAllSeen() {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    apis.notifications.markAllSeen,
  );
  return response.data;
}

export async function markSeen(id: string) {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    apis.notifications.markSeen(id),
  );
  return response.data;
}
