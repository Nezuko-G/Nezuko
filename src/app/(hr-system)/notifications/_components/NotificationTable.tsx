"use client";

import { useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { NotificationItem } from "@/app/(hr-system)/notifications/api/notifications";
import { cn } from "@/lib/utils";

interface NotificationTableProps {
  notifications: NotificationItem[];
  onMarkSeen: (id: string) => void;
  isPending: boolean;
}

export default function NotificationTable({
  notifications,
  onMarkSeen,
  isPending,
}: NotificationTableProps) {
  const t = useTranslations("notifications");

  const getTypeColor = (type: string) => {
    switch (type) {
      case "TASK":
        return "bg-blue-100 text-blue-700";
      case "LEAVE":
        return "bg-purple-100 text-purple-700";
      case "ATTENDANCE":
        return "bg-green-100 text-green-700";
      case "PAYROLL":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-status-error/10 text-status-error";
      case "MEDIUM":
        return "bg-status-warning/10 text-status-warning";
      case "LOW":
        return "bg-status-success/10 text-status-success";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (notifications.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-75">
        <p className="text-content-muted font-semibold text-sm">
          {t("empty")}
        </p>
      </div>
    );
  }

  return (
    <table className="w-full text-sm text-start">
      <thead>
        <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
          <th className="px-5 py-4 text-start">{t("table.message")}</th>
          <th className="px-5 py-4 text-center">{t("table.type")}</th>
          <th className="px-5 py-4 text-center">{t("table.priority")}</th>
          <th className="px-5 py-4 text-center">{t("table.status")}</th>
          <th className="px-5 py-4 text-center">{t("table.date")}</th>
          <th className="px-5 py-4 text-center">{t("table.actions")}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {notifications.map((notification) => (
          <tr
            key={notification.id}
            className={cn(
              "border-b border-gray-50 last:border-0 transition-colors",
              !notification.isSeen && "bg-primary/2",
            )}
          >
            <td className="px-5 py-4">
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold text-secondary text-xs">
                  {notification.title}
                </p>
                <p className="text-content-muted text-xs leading-relaxed line-clamp-2">
                  {notification.message}
                </p>
              </div>
            </td>
            <td className="px-5 py-4 text-center">
              {notification.type && (
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold border",
                    getTypeColor(notification.type),
                  )}
                >
                  {notification.type}
                </span>
              )}
            </td>
            <td className="px-5 py-4 text-center">
              {notification.priority && (
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-bold",
                    getPriorityColor(notification.priority),
                  )}
                >
                  {notification.priority}
                </span>
              )}
            </td>
            <td className="px-5 py-4 text-center">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold",
                  notification.isSeen
                    ? "bg-gray-100 text-content-muted"
                    : "bg-primary/10 text-primary",
                )}
              >
                {notification.isSeen
                  ? t("status.read")
                  : t("status.unread")}
              </span>
            </td>
            <td className="px-5 py-4 text-center">
              <span className="text-xs text-content-muted whitespace-nowrap">
                {formatDate(notification.createdAt)}
              </span>
            </td>
            <td className="px-5 py-4 text-center">
              {!notification.isSeen && (
                <button
                  onClick={() => onMarkSeen(notification.id)}
                  disabled={isPending}
                  className="p-1.5 rounded-lg hover:bg-primary/10 text-content-muted hover:text-primary transition-colors disabled:opacity-50"
                  title={t("markSeen")}
                >
                  <Eye size={15} />
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
