"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AttendanceWidget } from "@/app/(hr-system)/attendance/_components/AttendanceWidget";
import { MyTimesheetsFilters } from "@/app/(hr-system)/attendance/_components/MyTimesheetsFilters";
import { MyTimesheetsTable } from "@/app/(hr-system)/attendance/_components/MyTimesheetsTable";
import { useMyTimesheets } from "@/app/(hr-system)/attendance/hooks/useMyTimesheets";
import { SpinnerIndicator } from "@/components/ui/data-states";

export default function MyAttendancePage() {
  const t = useTranslations("timesheet");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filters = {
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
  };

  const { data: timesheets = [], isLoading, isError, error, refetch, isFetching } = useMyTimesheets(filters);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <AttendanceWidget />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-secondary">{t("myTimesheets.title")}</h2>
        {isFetching && !isLoading && (
          <SpinnerIndicator show />
        )}
      </div>

      <div className="mb-6">
        <MyTimesheetsFilters
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
        />
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.date")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.checkIn")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.checkOut")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.totalHours")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.overtime")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.status")}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: "6rem" }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium mb-4">
            {error instanceof Error ? error.message : t("loadError")}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {t("tryAgain")}
          </button>
        </div>
      )}

      {!isLoading && !isError && timesheets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-base">{t("myTimesheets.empty")}</p>
        </div>
      )}

      {!isLoading && !isError && timesheets.length > 0 && (
        <MyTimesheetsTable timesheets={timesheets} />
      )}
    </div>
  );
}
