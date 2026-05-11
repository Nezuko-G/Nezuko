"use client";

import { useTranslations } from "next-intl";
import { useDepreciationReport } from "@/hooks/useAssets";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DepreciationReportPage() {
  const tReport = useTranslations("assets.report");
  const tDetails = useTranslations("assets.details");
  const { data: reportData, isLoading } = useDepreciationReport();

  if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-secondary">{tReport("title")}</h1>
        <Button variant="outline" className="gap-2"><Download size={18} /> {tReport("exportCsv")}</Button>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-background text-content-muted border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">{tReport("table.asset")}</th>
              <th className="px-6 py-4">{tReport("table.purchaseCost")}</th>
              <th className="px-6 py-4">{tReport("table.bookValue")}</th>
              <th className="px-6 py-4 w-1/4">{tReport("table.depreciation")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reportData?.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 font-bold text-content-dark">{item.name}</td>
                <td className="px-6 py-4">{tDetails("currency")}{item.purchaseCost.toLocaleString()}</td>
                <td className="px-6 py-4 font-black">{tDetails("currency")}{item.bookValue.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className={`h-1.5 rounded-full ${item.isFullyDepreciated ? 'bg-status-error' : 'bg-primary'}`} 
                      style={{ width: `${item.depreciationPercentage}%` }}
                    />
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