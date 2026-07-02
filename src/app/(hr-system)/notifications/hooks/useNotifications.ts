import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markAllSeen,
  markSeen,
  type NotificationFilter,
} from "@/app/(hr-system)/notifications/api/notifications";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export function useNotifications(params?: {
  page?: number;
  limit?: number;
  filter?: NotificationFilter;
}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    refetchInterval: 300_000,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 300_000,
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();
  const t = useTranslations("notifications.errors");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const markSeenMutation = useMutation({
    mutationFn: markSeen,
    onSuccess: invalidate,
    onError: () => toast.error(t("markSeen")),
  });

  const markAllSeenMutation = useMutation({
    mutationFn: markAllSeen,
    onSuccess: invalidate,
    onError: () => toast.error(t("markAllSeen")),
  });

  return {
    markSeen: markSeenMutation,
    markAllSeen: markAllSeenMutation,
    isPending:
      markSeenMutation.isPending || markAllSeenMutation.isPending,
  };
}
