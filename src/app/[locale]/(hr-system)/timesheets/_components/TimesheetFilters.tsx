"use client";

import { useTranslations } from "next-intl";
import { SelectWithSearch } from "@/components/ui/select-with-search";
import type { TimesheetStatus } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";

interface Props {
  statusFilter: TimesheetStatus | "ALL";
  onStatusChange: (status: TimesheetStatus | "ALL") => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  userId: string;
  onUserIdChange: (id: string) => void;
  employees: { id: string; firstName: string; lastName: string }[];
}

export function TimesheetFilters({
  statusFilter,
  onStatusChange,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  userId,
  onUserIdChange,
  employees,
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
        <div className="w-56">
          <SelectWithSearch
            placeholder={t("employee")}
            options={employees}
            value={userId}
            onChange={onUserIdChange}
            getOptionValue={(e) => e.id}
            getOptionLabel={(e) => `${e.firstName} ${e.lastName} (${e.id})`}
            searchFields={[(e) => e.firstName, (e) => e.lastName, (e) => `${e.firstName} ${e.lastName}`, (e) => e.id]}
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
    </div>
  );
}
