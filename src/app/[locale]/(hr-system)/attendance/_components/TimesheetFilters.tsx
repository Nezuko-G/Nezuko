"use client";

import { useTranslations } from "next-intl";
import type { TimesheetStatus } from "@/app/[locale]/(hr-system)/attendance/types/timesheet.dto";

interface Props {
  statusFilter: TimesheetStatus | "ALL";
  onStatusChange: (status: TimesheetStatus | "ALL") => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
}

export function TimesheetFilters({ statusFilter, onStatusChange, fromDate, toDate, onFromDateChange, onToDateChange }: Props) {
  const t = useTranslations("timesheet");

  const statusOptions = [
    { value: "ALL", label: t("filters.all") },
    { value: "DRAFT", label: t("filters.draft") },
    { value: "SUBMITTED", label: t("filters.submitted") },
    { value: "APPROVED", label: t("filters.approved") },
    { value: "REJECTED", label: t("filters.rejected") },
  ] as const;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">{t("filters.from")}</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">{t("filters.to")}</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>
      <div className="w-px h-6 bg-gray-200" />
      {statusOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onStatusChange(opt.value as TimesheetStatus | "ALL")}
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
