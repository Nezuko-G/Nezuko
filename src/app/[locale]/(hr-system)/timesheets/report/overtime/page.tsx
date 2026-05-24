"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useOvertimeReport } from "@/app/[locale]/(hr-system)/timesheets/hooks/useTimesheets";
import { TableSkeleton, ErrorState, EmptyState, SpinnerIndicator } from "@/components/ui/data-states";

export default function OvertimeReportPage() {
  const t = useTranslations("timesheet.overtime");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [departmentId, setDepartmentId] = useState("");

  const filters = useMemo(
    () => ({ startDate, endDate, ...(departmentId ? { departmentId } : {}) }),
    [startDate, endDate, departmentId]
  );

  const { data: report, isLoading, isError, error, refetch, isFetching } = useOvertimeReport(filters);
  const hasFilters = !!startDate && !!endDate;

  function exportCsv() {
    if (!report?.items.length) return;

    const headers = [t("employee"), t("department"), t("date"), t("totalHours"), t("overtimeHours")];
    const rows = report.items.map((item) => [
      item.employeeName,
      item.departmentName || "",
      item.date,
      item.totalHours.toFixed(2),
      item.overtimeHours.toFixed(2),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `overtime-report-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const skeletonColumns = [
    { key: "employee", label: t("employee") },
    { key: "department", label: t("department") },
    { key: "date", label: t("date") },
    { key: "totalHours", label: t("totalHours") },
    { key: "overtimeHours", label: t("overtimeHours") },
  ];

  return (
    <RoleGuard allowedRoles={["HR", "MANAGER"]}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-secondary">{t("title")}</h1>
            <SpinnerIndicator show={isFetching && !isLoading} />
          </div>
          {report && report.items.length > 0 && (
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={16} />
              {t("exportCsv")}
            </button>
          )}
        </div>

        <div className="mb-6 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">{t("from")}</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">{t("to")}</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">{t("department")}</label>
            <input
              type="text"
              placeholder={t("departmentId")}
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all w-40"
            />
          </div>
        </div>

        {!hasFilters && !isLoading && (
          <EmptyState message={t("selectDateRange")} />
        )}

        {isLoading && <TableSkeleton columns={skeletonColumns} rows={3} />}

        {isError && !isLoading && (
          <ErrorState
            message={error instanceof Error ? error.message : t("loadError")}
            onRetry={() => refetch()}
          />
        )}

        {hasFilters && !isLoading && !isError && report && report.items.length === 0 && (
          <EmptyState message={t("noData")} />
        )}

        {hasFilters && !isLoading && !isError && report && report.items.length > 0 && (
          <div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600 font-medium">{t("totalOvertime")}</span>
              <span className="text-2xl font-bold text-primary">{report.totalOvertime.toFixed(2)} {t("hours")}</span>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("employee")}</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("department")}</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("date")}</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("totalHours")}</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("overtimeHours")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.items.map((item, i) => (
                      <tr key={`${item.userId}-${item.date}-${i}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{item.employeeName}</td>
                        <td className="px-4 py-3 text-gray-600">{item.departmentName || "—"}</td>
                        <td className="px-4 py-3 text-gray-600">{item.date}</td>
                        <td className="px-4 py-3 text-gray-600">{item.totalHours.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="text-amber-600 font-medium">{item.overtimeHours.toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
