"use client";

import { useTranslations } from "next-intl";
import type { LeaveRequest } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";

interface Props {
  statusFilter: LeaveRequest["status"] | "ALL";
  onStatusChange: (status: LeaveRequest["status"] | "ALL") => void;
}

export function LeaveFilters({ statusFilter, onStatusChange }: Props) {
  const t = useTranslations("leave.filters");

  const statusOptions = [
    { value: "ALL", label: t("all") },
    { value: "PENDING", label: t("pending") },
    { value: "APPROVED", label: t("approved") },
    { value: "REJECTED", label: t("rejected") },
    { value: "CANCELLED", label: t("cancelled") },
  ] as const;

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