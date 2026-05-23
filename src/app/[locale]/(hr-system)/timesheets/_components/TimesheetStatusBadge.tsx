"use client";

import { useTranslations } from "next-intl";
import type { TimesheetStatus } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";

interface Props {
  status: TimesheetStatus;
}

export function TimesheetStatusBadge({ status }: Props) {
  const t = useTranslations("timesheet.status");

  const config = {
    DRAFT: { label: t("DRAFT"), className: "bg-gray-100 text-gray-600 border-gray-200" },
    SUBMITTED: { label: t("SUBMITTED"), className: "bg-blue-50 text-blue-600 border-blue-200" },
    APPROVED: { label: t("APPROVED"), className: "bg-green-50 text-green-600 border-green-200" },
    REJECTED: { label: t("REJECTED"), className: "bg-red-50 text-red-500 border-red-200" },
  };

  const { label, className } = config[status];
  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${className}`}>
      {label}
    </span>
  );
}
