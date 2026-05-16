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
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  const totalCost =
    report?.reduce((acc, curr) => acc + curr.totalMonthlyCost, 0) || 0;
  const totalEmployees =
    report?.reduce((acc, curr) => acc + curr.activeEnrollments, 0) || 0;
  const activePlans = report?.filter((r) => r.isActive).length || 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary flex items-center gap-3">
            <FileBarChart2 size={32} className="text-primary" />
            {t("title")}
          </h1>
          <p className="text-sm font-medium text-content-muted">
            {t("subtitle")}
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={!report?.length}
          className="px-6 py-2.5 bg-card border border-gray-200 text-content-dark rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Download size={16} />
          {t("exportCsv")}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <DollarSign size={20} />
          </div>
          <p className="text-sm font-bold text-content-muted">
            {t("stats.totalCost")}
          </p>
          <p className="text-2xl font-black text-content-dark">
            {totalCost.toLocaleString()} {t("currency")}
          </p>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <Users size={20} />
          </div>
          <p className="text-sm font-bold text-content-muted">
            {t("stats.enrolled")}
          </p>
          <p className="text-2xl font-black text-secondary">{totalEmployees}</p>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <Activity size={20} />
          </div>
          <p className="text-sm font-bold text-content-muted">
            {t("stats.activePlans")}
          </p>
          <p className="text-2xl font-black text-content-dark">{activePlans}</p>
        </div>
      </div>

      <div className="bg-card rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-right border-collapse text-sm">
          <thead>
            <tr className="bg-background/50 text-content-muted text-xs font-bold uppercase border-b border-gray-50">
              <th className="px-6 py-5">{t("table.planName")}</th>
              <th className="px-6 py-5 text-center">{t("table.type")}</th>
              <th className="px-6 py-5 text-center">{t("table.enrolled")}</th>
              <th className="px-6 py-5">{t("table.monthlyCost")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {report?.map((row) => (
              <tr
                key={row.planId}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-5 font-bold text-content-dark">
                  {row.planName}
                </td>
                <td className="px-6 py-5 text-center">
                  <InsurancePlanTypeBadge type={row.type} />
                </td>
                <td className="px-6 py-5 text-center font-bold">
                  {row.activeEnrollments}
                </td>
                <td className="px-6 py-5 font-black text-secondary text-base">
                  {row.totalMonthlyCost.toLocaleString()} {t("currency")}
                </td>
              </tr>
            ))}
            {!report?.length && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 font-bold text-content-muted"
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
