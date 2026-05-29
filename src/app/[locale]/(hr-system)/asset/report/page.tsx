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
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
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
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4 md:p-8 text-right">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-extrabold text-secondary flex items-center gap-2">
          {tReport("title")}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs uppercase tracking-wider">
              {tReport("stats.totalCost")}
            </p>
            <p className="text-2xl font-black text-secondary mt-1">
              ${totalOriginalCost.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-status-success/10 text-status-success rounded-2xl shrink-0">
            <Package size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs uppercase tracking-wider">
              {tReport("stats.currentValue")}
            </p>
            <p className="text-2xl font-black text-secondary mt-1">
              ${totalCurrentValue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-status-warning/10 text-status-warning rounded-2xl shrink-0">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs uppercase tracking-wider">
              {tReport("stats.avgDepreciation")}
            </p>
            <p className="text-2xl font-black text-secondary mt-1">
              {avgDepreciation}%
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm pt-2">
        <table className="w-full text-sm text-right border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 text-right">{tList("table.name")}</th>
              <th className="px-6 py-4 text-right">
                {tReport("table.purchaseDate")}
              </th>
              <th className="px-6 py-4 text-right">
                {tReport("table.originalCost")}
              </th>
              <th className="px-6 py-4 text-center">{tReport("table.age")}</th>
              <th className="px-6 py-4 text-right">
                {tReport("table.currentValue")}
              </th>
              <th className="px-6 py-4 text-right ps-8">
                {tReport("table.depreciation")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {report?.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <p className="font-semibold text-secondary group-hover:text-primary transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-content-muted font-mono mt-0.5">
                      {item.serialNumber || "---"}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-secondary">
                  {isMounted && item.purchaseDate
                    ? new Date(item.purchaseDate).toLocaleDateString()
                    : "---"}
                </td>
                <td className="px-6 py-4 font-semibold text-secondary">
                  ${item.purchaseCost.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs font-bold text-secondary">
                    {item.elapsedYears.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-secondary text-base">
                  ${item.currentBookValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 pl-8 min-w-[150px]">
                  <div className="space-y-1.5 max-w-[120px]">
                    <div className="flex justify-between text-[10px] font-bold">
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
  );
}
