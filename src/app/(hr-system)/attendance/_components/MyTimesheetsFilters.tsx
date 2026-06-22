"use client";

import { useTranslations } from "next-intl";
import type { TimesheetStatus } from "@/app/(hr-system)/attendance/types/timesheet.dto";

interface Props {
  statusFilter: TimesheetStatus | "ALL";
  onStatusChange: (status: TimesheetStatus | "ALL") => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
}

export function MyTimesheetsFilters({ statusFilter, onStatusChange, fromDate, toDate, onFromDateChange, onToDateChange }: Props) {
  const t = useTranslations("timesheet");

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
      <div className="flex items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as TimesheetStatus | "ALL")}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all bg-white"
        >
          <option value="ALL">{t("filters.all")}</option>
          <option value="DRAFT">{t("filters.draft")}</option>
          <option value="SUBMITTED">{t("filters.submitted")}</option>
          <option value="APPROVED">{t("filters.approved")}</option>
          <option value="REJECTED">{t("filters.rejected")}</option>
        </select>
      </div>
    </div>
  );
}
