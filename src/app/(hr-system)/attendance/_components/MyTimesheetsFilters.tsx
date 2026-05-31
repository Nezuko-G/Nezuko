"use client";

import { useTranslations } from "next-intl";

interface Props {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
}

export function MyTimesheetsFilters({ fromDate, toDate, onFromDateChange, onToDateChange }: Props) {
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
    </div>
  );
}
