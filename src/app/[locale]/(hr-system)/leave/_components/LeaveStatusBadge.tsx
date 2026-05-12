"use client";

import { useTranslations } from "next-intl";
import type { LeaveRequest } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";

interface Props {
  status: LeaveRequest["status"];
}

export function LeaveStatusBadge({ status }: Props) {
  const t = useTranslations("leave.statusBadge");

  const config = {
    PENDING: { label: t("pending"), className: "bg-amber-50 text-amber-600 border-amber-200" },
    APPROVED: { label: t("approved"), className: "bg-green-50 text-green-600 border-green-200" },
    REJECTED: { label: t("rejected"), className: "bg-red-50 text-red-500 border-red-200" },
    CANCELLED: { label: t("cancelled"), className: "bg-gray-100 text-gray-400 border-gray-200" },
  };

  const { label, className } = config[status];
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${className}`}>
      {label}
    </span>
  );
}