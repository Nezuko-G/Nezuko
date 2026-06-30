"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import type { TimesheetStatus } from "@/app/(hr-system)/timesheets/types/timesheet.dto";

interface Props {
  statusFilter: TimesheetStatus | "ALL";
  onStatusChange: (status: TimesheetStatus | "ALL") => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TimesheetFilters({
  statusFilter,
  onStatusChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  searchQuery,
  onSearchChange,
}: Props) {
  const t = useTranslations("timesheet.filters");

  const statusOptions = [
    { value: "ALL", label: t("all") },
    { value: "DRAFT", label: t("draft") },
    { value: "SUBMITTED", label: t("submitted") },
    { value: "APPROVED", label: t("approved") },
    { value: "REJECTED", label: t("rejected") },
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-50 max-w-lg">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("employee")}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">{t("from")}</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500">{t("to")}</label>
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
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
