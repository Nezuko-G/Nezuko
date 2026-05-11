"use client";

import type { LeaveRequest } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";

interface Props {
  statusFilter: LeaveRequest["status"] | "ALL";
  onStatusChange: (status: LeaveRequest["status"] | "ALL") => void;
}

const statusOptions = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export function LeaveFilters({ statusFilter, onStatusChange }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {statusOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onStatusChange(opt.value as LeaveRequest["status"] | "ALL")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
            ${statusFilter === opt.value
              ? "bg-primary/10 text-primary border-primary/30 ring-2 ring-primary/20"
              : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}