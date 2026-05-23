"use client";

import { useTranslations } from "next-intl";
import { AlertCircle, RefreshCw } from "lucide-react";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useMyTimesheets } from "@/app/[locale]/(hr-system)/timesheets/hooks/useTimesheets";
import { TimesheetTable } from "@/app/[locale]/(hr-system)/timesheets/_components/TimesheetTable";

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-12 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" /></td>
    </tr>
  );
}

export default function MyTimesheetsPage() {
  const t = useTranslations("timesheet");
  const { data: timesheets = [], isLoading, isError, error, refetch, isFetching } = useMyTimesheets();

  return (
    <RoleGuard allowedRoles={["EMPLOYEE"]}>
      <div className="p-2 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-secondary">{t("myTimesheets.title")}</h1>
          {isFetching && !isLoading && (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          )}
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
                <SkeletonRow /><SkeletonRow /><SkeletonRow />
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
            <p className="text-gray-400 text-base">{t("myTimesheets.empty")}</p>
          </div>
        )}

        {!isLoading && !isError && timesheets.length > 0 && (
          <TimesheetTable timesheets={timesheets} isHR={false} />
        )}
      </div>
    </RoleGuard>
  );
}
