"use client";

import { useTranslations } from "next-intl";
import { useCoverageReport } from "@/app/[locale]/(hr-system)/insurance/hooks/useInsurance";
import {
  Loader2,
  Download,
  FileBarChart2,
  Users,
  DollarSign,
  Activity,
} from "lucide-react";
import InsurancePlanTypeBadge from "../_components/InsurancePlanTypeBadge";

export default function CoverageReportPage() {
  const t = useTranslations("insurance.report");
  const { data: report, isLoading } = useCoverageReport();

  const handleExportCSV = () => {
    if (!report) return;
    const headers = [
      "Plan Name",
      "Type",
      "Active Enrollments",
      "Total Monthly Cost",
      "Status",
    ];
    const csvContent = [
      headers.join(","),
      ...report.map(
        (row) =>
          `"${row.planName}","${row.type}",${row.activeEnrollments},${row.totalMonthlyCost},"${row.isActive ? "Active" : "Inactive"}"`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `coverage_report_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );

  const totalCost =
    report?.reduce((acc, curr) => acc + curr.totalMonthlyCost, 0) || 0;
  const totalEmployees =
    report?.reduce((acc, curr) => acc + curr.activeEnrollments, 0) || 0;
  const activePlans = report?.filter((r) => r.isActive).length || 0;

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4 md:p-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold text-secondary flex items-center gap-2">
            <FileBarChart2 size={24} className="text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm font-medium text-content-muted">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            disabled={!report?.length}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-card text-secondary font-bold text-sm shadow-sm hover:bg-gray-50 transition disabled:opacity-50"
          >
            <Download size={16} />
            <span>{t("exportCsv")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs uppercase tracking-wider">
              {t("stats.totalCost")}
            </p>
            <p className="text-2xl font-black text-secondary mt-1">
              {totalCost.toLocaleString()} {t("currency")}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-status-success/10 text-status-success rounded-2xl shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs uppercase tracking-wider">
              {t("stats.enrolled")}
            </p>
            <p className="text-2xl font-black text-secondary mt-1">
              {totalEmployees}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-status-warning/10 text-status-warning rounded-2xl shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs uppercase tracking-wider">
              {t("stats.activePlans")}
            </p>
            <p className="text-2xl font-black text-secondary mt-1">
              {activePlans}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm pt-2">
        <table className="w-full text-sm text-right border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 text-right">{t("table.planName")}</th>
              <th className="px-6 py-4 text-center">{t("table.type")}</th>
              <th className="px-6 py-4 text-center">{t("table.enrolled")}</th>
              <th className="px-6 py-4 text-right pl-8">
                {t("table.monthlyCost")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {report?.map((row) => (
              <tr
                key={row.planId}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-secondary group-hover:text-primary transition-colors">
                    {row.planName}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <InsurancePlanTypeBadge type={row.type} />
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs font-bold text-secondary">
                    {row.activeEnrollments}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-secondary text-base pl-8">
                  {row.totalMonthlyCost.toLocaleString()} {t("currency")}
                </td>
              </tr>
            ))}
            {!report?.length && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-16 font-bold text-content-muted"
                >
                  {t("empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
