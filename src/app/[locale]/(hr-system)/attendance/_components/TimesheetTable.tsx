"use client";

import { useTranslations } from "next-intl";
import type { Timesheet } from "@/app/[locale]/(hr-system)/attendance/types/timesheet.dto";

interface Props {
  timesheets: Timesheet[];
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(date: Date | null) {
  if (!date) return "—";
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function formatHours(hours: number) {
  return hours.toFixed(2);
}

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("timesheet");

  const styles: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
    SUBMITTED: "bg-blue-50 text-blue-600 border-blue-200",
    APPROVED: "bg-green-50 text-green-600 border-green-200",
    REJECTED: "bg-red-50 text-red-500 border-red-200",
  };

  const labels: Record<string, string> = {
    DRAFT: t("status.DRAFT"),
    SUBMITTED: t("status.SUBMITTED"),
    APPROVED: t("status.APPROVED"),
    REJECTED: t("status.REJECTED"),
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.DRAFT}`}>
      {labels[status]}
    </span>
  );
}

export function TimesheetTable({ timesheets }: Props) {
  const t = useTranslations("timesheet");

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
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
            </tr>
          </thead>
          <tbody>
            {timesheets.map((ts) => (
              <tr key={ts.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {ts.user ? `${ts.user.firstName} ${ts.user.lastName}` : ts.userId.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-gray-600">{ts.user?.employeeCode || "—"}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(ts.date)}</td>
                <td className="px-4 py-3 text-gray-600">{formatTime(ts.checkIn)}</td>
                <td className="px-4 py-3 text-gray-600">{formatTime(ts.checkOut)}</td>
                <td className="px-4 py-3 text-gray-600">{formatHours(ts.totalHours)}</td>
                <td className="px-4 py-3">
                  {ts.overtimeHours > 0 ? (
                    <span className="text-amber-600 font-medium">{formatHours(ts.overtimeHours)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3"><StatusBadge status={ts.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
