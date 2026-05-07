"use client"

import { useTranslations } from "next-intl";
import { Plane, Frown, Megaphone, DollarSign, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeaveRequest } from "@/types/dto/leave.dto";
import LeaveStatusBadge from "./LeaveStatusBadge";
import Image from "next/image";

interface LeaveListTableProps {
  requests: LeaveRequest[];
  onCancel?: (id: string) => void;
  onReview?: (id: string, status: "APPROVED" | "REJECTED", note?: string) => void;
  showEmployee?: boolean;
  className?: string;
}

const leaveIcons: Record<string, LucideIcon> = {
  ANNUAL: Plane,
  SICK: Frown,
  OFFICIAL: Megaphone,
  UNPAID: DollarSign,
};

const leaveTypeLabels: Record<string, string> = {
  ANNUAL: "annual",
  SICK: "sick",
  OFFICIAL: "official",
  UNPAID: "unpaid",
};

export default function LeaveListTable({
  requests,
  onCancel,
  onReview,
  showEmployee = false,
  className,
}: LeaveListTableProps) {
  const t = useTranslations("dashboard.leave");
  const tBalances = useTranslations("dashboard.leaveBalances");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (requests.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-12 text-gray-500 font-medium",
          className
        )}
      >
        {t("empty")}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {showEmployee && (
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
                {t("table.employee")}
              </th>
            )}
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
              {t("table.type")}
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
              {t("table.startDate")}
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
              {t("table.endDate")}
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
              {t("table.days")}
            </th>
            <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500">
              {t("table.status")}
            </th>
            <th className="text-right py-4 px-4 text-sm font-semibold text-gray-500">
              {t("table.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => {
            const Icon = leaveIcons[request.type];
            const typeLabel = tBalances(leaveTypeLabels[request.type]);
            const days = calculateDays(request.startDate, request.endDate);
            const statusLabel = t(`status.${request.status.toLowerCase()}`);
            const canCancel = onCancel && request.status === "PENDING";
            const canReview = onReview && request.status === "PENDING";

            return (
              <tr
                key={request.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                {showEmployee && (
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-100 overflow-hidden shrink-0">
                        <Image
                          src={`https://i.pravatar.cc/150?u=${request.employeeId}`}
                          alt={request.employeeName || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {request.employeeName}
                      </span>
                    </div>
                  </td>
                )}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {typeLabel}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {formatDate(request.startDate)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">
                  {formatDate(request.endDate)}
                </td>
                <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                  {days}
                </td>
                <td className="py-4 px-4">
                  <LeaveStatusBadge status={request.status} label={statusLabel} />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    {canReview && (
                      <>
                        <button
                          onClick={() =>
                            onReview?.(request.id, "APPROVED")
                          }
                          className="px-3 py-1.5 text-sm font-semibold text-green-600 
hover:bg-green-50 rounded-lg transition-colors"
                        >
                          {t("review.approve")}
                        </button>
                        <button
                          onClick={() =>
                            onReview?.(request.id, "REJECTED")
                          }
                          className="px-3 py-1.5 text-sm font-semibold text-red-600 
hover:bg-red-50 rounded-lg transition-colors"
                        >
                          {t("review.reject")}
                        </button>
                      </>
                    )}
                    {canCancel && (
                      <button
                        onClick={() => onCancel?.(request.id)}
                        className="px-3 py-1.5 text-sm font-semibold text-gray-500 
hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        {t("form.cancel")}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}