"use client";

import type { LeaveRequest } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";

interface Props {
  status: LeaveRequest["status"];
}

const config = {
  PENDING: { label: "Pending", className: "bg-amber-50 text-amber-600 border-amber-200" },
  APPROVED: { label: "Approved", className: "bg-green-50 text-green-600 border-green-200" },
  REJECTED: { label: "Rejected", className: "bg-red-50 text-red-500 border-red-200" },
  CANCELLED: { label: "Cancelled", className: "bg-gray-100 text-gray-400 border-gray-200" },
};

export function LeaveStatusBadge({ status }: Props) {
  const { label, className } = config[status];
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${className}`}>
      {label}
    </span>
  );
}