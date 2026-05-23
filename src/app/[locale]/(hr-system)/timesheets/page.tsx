"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AlertCircle, RefreshCw, BarChart3 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTimesheets } from "@/app/[locale]/(hr-system)/timesheets/hooks/useTimesheets";
import { useAuthStore } from "@/hooks/useAuthStore";
import { TimesheetFilters } from "@/app/[locale]/(hr-system)/timesheets/_components/TimesheetFilters";
import { TimesheetTable } from "@/app/[locale]/(hr-system)/timesheets/_components/TimesheetTable";
import { SubmitTimesheetForm } from "@/app/[locale]/(hr-system)/timesheets/_components/SubmitTimesheetForm";
import { useEmployeeMapStore } from "@/app/[locale]/(hr-system)/timesheets/store/employee-map.store";
import type { TimesheetStatus } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-3"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" /></td>
    </tr>
  );
}

export default function TimesheetsPage() {
  const t = useTranslations("timesheet");
  const { role } = useAuthStore();
  const isHR = role === "HR" || role === "MANAGER";
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userId, setUserId] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filters = {
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    ...(fromDate && { startDate: fromDate }),
    ...(toDate && { endDate: toDate }),
    ...(userId && { userId }),
  };

  const { data: timesheets = [], isLoading, isError, error, refetch, isFetching } = useTimesheets(filters);
  const employees = useEmployeeMapStore((s) => s.employees);
  const setFromTimesheets = useEmployeeMapStore((s) => s.setFromTimesheets);

  useEffect(() => {
    if (timesheets.length > 0) {
      setFromTimesheets(timesheets);
    }
  }, [timesheets, setFromTimesheets]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-secondary">
            {isHR ? t("title") : t("myTimesheets.title")}
          </h1>
          {isFetching && !isLoading && (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-3">
          {role !== "EMPLOYEE" && (
            <Link
              href="/timesheets/report/overtime"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-secondary text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors border border-gray-200 shadow-sm"
            >
              <BarChart3 size={16} />
              {t("overtime.title")}
            </Link>
          )}
          {role === "HR" && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              {t("submit.title")}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <TimesheetFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          userId={userId}
          onUserIdChange={setUserId}
          employees={employees}
        />
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.employee")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.employeeCode")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.date")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.checkIn")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.checkOut")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.totalHours")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.overtime")}</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("table.status")}</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
            </tbody>
          </table>
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-4">
            {error instanceof Error ? error.message : t("loadError")}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            {t("tryAgain")}
          </button>
        </div>
      )}

      {!isLoading && !isError && timesheets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-base">{t("empty")}</p>
        </div>
      )}

      {!isLoading && !isError && timesheets.length > 0 && (
        <TimesheetTable timesheets={timesheets} isHR={isHR} />
      )}

      {showForm && <SubmitTimesheetForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
