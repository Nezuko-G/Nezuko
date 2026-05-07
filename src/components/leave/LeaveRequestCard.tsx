"use client"

import { useTranslations } from "next-intl";
import { Calendar, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LeaveRequest } from "@/types/dto/leave.dto";
import LeaveStatusBadge from "./LeaveStatusBadge";
import Image from "next/image";

interface LeaveRequestCardProps {
  request: LeaveRequest;
  onCancel?: (id: string) => void;
  onView?: (id: string) => void;
  showEmployee?: boolean;
  className?: string;
}

const leaveTypeLabels: Record<string, string> = {
  ANNUAL: "annual",
  SICK: "sick",
  OFFICIAL: "official",
  UNPAID: "unpaid",
};

export default function LeaveRequestCard({
  request,
  onCancel,
  onView,
  showEmployee = false,
  className,
}: LeaveRequestCardProps) {
  const t = useTranslations("dashboard.leave");
  const tBalances = useTranslations("dashboard.leaveBalances");

  const typeLabel = tBalances(leaveTypeLabels[request.type]);

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

  const days = calculateDays(request.startDate, request.endDate);
  const statusLabel = t(`status.${request.status.toLowerCase()}`);

  const canCancel =
    onCancel && request.status === "PENDING";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {showEmployee && request.employeeName && (
            <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden shrink-0">
              <Image
                src={`https://i.pravatar.cc/150?u=${request.employeeId}`}
                alt={request.employeeName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            {showEmployee && request.employeeName && (
              <p className="text-sm font-medium text-gray-900 mb-0.5">
                {request.employeeName}
              </p>
            )}
            <p className="text-lg font-bold text-gray-900">{typeLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LeaveStatusBadge status={request.status} label={statusLabel} />
          {canCancel && (
            <button
              onClick={() => onCancel?.(request.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              title={t("form.cancel")}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar size={16} className="text-gray-400" />
          <span>
            {formatDate(request.startDate)} - {formatDate(request.endDate)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={16} className="text-gray-400" />
          <span>
            {days} {days === 1 ? tBalances("day") : tBalances("days")}
          </span>
        </div>
      </div>

      {request.reason && (
        <p className="text-sm text-gray-500 font-medium line-clamp-2">
          {request.reason}
        </p>
      )}

      {onView && (
        <button
          onClick={() => onView?.(request.id)}
          className="w-full py-2 text-sm font-semibold text-primary hover:underline transition-colors"
        >
          View Details
        </button>
      )}
    </div>
  );
}