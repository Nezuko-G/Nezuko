"use client";

import { useTranslations } from "next-intl";
import { useDepreciationReport } from "@/app/[locale]/(hr-system)/asset/hooks/useAssets";
import {
  Loader2,
  FileBarChart2,
  TrendingDown,
  DollarSign,
  Package,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DepreciationReportPage() {
  const tList = useTranslations("assets.list");
  const tReport = useTranslations("assets.report");
  const { data: report, isLoading } = useDepreciationReport();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const func = () => {
    setIsMounted(true);
    }
    func();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const totalOriginalCost =
    report?.reduce((acc, item) => acc + item.purchaseCost, 0) || 0;
  const totalCurrentValue =
    report?.reduce((acc, item) => acc + item.currentBookValue, 0) || 0;
  const avgDepreciation = report?.length
    ? Math.round(
        report.reduce((acc, item) => acc + item.depreciationPercentage, 0) /
          report.length,
      )
    : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary flex items-center gap-3">
            <FileBarChart2 size={32} className="text-primary" />
            {tReport("title")}
          </h1>
          <p className="text-sm text-content-muted font-medium">
            {tReport("subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <DollarSign size={20} />
          </div>
          <p className="text-sm font-bold text-content-muted">
            {tReport("stats.totalCost")}
          </p>
          <p className="text-2xl font-black text-content-dark">
            ${totalOriginalCost.toLocaleString()}
          </p>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
            <Package size={20} />
          </div>
          <p className="text-sm font-bold text-content-muted">
            {tReport("stats.currentValue")}
          </p>
          <p className="text-2xl font-black text-secondary">
            ${totalCurrentValue.toLocaleString()}
          </p>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
            <TrendingDown size={20} />
          </div>
          <p className="text-sm font-bold text-content-muted">
            {tReport("stats.avgDepreciation")}
          </p>
          <p className="text-2xl font-black text-content-dark">
            {avgDepreciation}%
          </p>
        </div>
      </div>

      <div className="bg-card rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-background/50 text-content-muted text-xs font-bold uppercase tracking-wider border-b border-gray-50">
                <th className="px-8 py-5">{tList("table.name")}</th>
                <th className="px-6 py-5">{tReport("table.purchaseDate")}</th>
                <th className="px-6 py-5">{tReport("table.originalCost")}</th>
                <th className="px-6 py-5">{tReport("table.age")}</th>
                <th className="px-6 py-5">{tReport("table.currentValue")}</th>
                <th className="px-6 py-5">{tReport("table.depreciation")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {report?.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <p className="font-bold text-content-dark group-hover:text-primary transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-content-muted font-mono">
                      {item.serialNumber || "---"}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-content">
                    {isMounted
                      ? new Date(item.purchaseDate).toLocaleDateString()
                      : "---"}
                  </td>
                  <td className="px-6 py-5 font-bold text-content-dark">
                    ${item.purchaseCost.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-black text-secondary">
                      {item.elapsedYears.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-black text-secondary text-base">
                    ${item.currentBookValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 min-w-37.5">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-black">
                        <span
                          className={
                            item.depreciationPercentage > 80
                              ? "text-status-error"
                              : "text-primary"
                          }
                        >
                          {item.depreciationPercentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            item.depreciationPercentage > 80
                              ? "bg-status-error"
                              : "bg-primary"
                          }`}
                          style={{ width: `${item.depreciationPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
