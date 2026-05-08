import { getTranslations } from "next-intl/server";
import { Download } from "lucide-react";
import { Asset } from "@/types/dto/asset.dto";
import { Button } from "@/components/ui/button";

// Dummy data for the report (we reuse the structure, but you would normally fetch this from GET /assets/report/depreciation)
const DUMMY_REPORT_DATA = [
  { id: "1", name: "Dell XPS 15", purchaseDate: "2024-03-01", purchaseCost: 1800, status: "ASSIGNED" },
  { id: "2", name: "HP Monitor 27\"", purchaseDate: "2022-01-15", purchaseCost: 420, status: "ASSIGNED" },
  { id: "3", name: "Old ThinkPad", purchaseDate: "2020-02-01", purchaseCost: 1200, status: "RETIRED" },
  { id: "4", name: "MacBook Pro", purchaseDate: "2025-06-10", purchaseCost: 2500, status: "AVAILABLE" },
];

export default async function DepreciationReportPage() {
  const tReport = await getTranslations("assets.report");
  const tList = await getTranslations("assets.list");
  const tDetails = await getTranslations("assets.details");

  const currentYear = new Date().getFullYear(); // 2026

  // Calculate logic for the report
  const processedData = DUMMY_REPORT_DATA.map((asset) => {
    const purchaseYear = new Date(asset.purchaseDate).getFullYear();
    // Using a simpler formula for UI representation based on issue description
    const rawAge = Math.max(0, currentYear - purchaseYear); 
    
    // We max out at 5 years for depreciation
    const cappedAge = Math.min(rawAge, 5); 
    
    const depreciationPerYear = asset.purchaseCost / 5;
    const totalDepreciatedAmount = depreciationPerYear * cappedAge;
    
    const bookValue = asset.purchaseCost - totalDepreciatedAmount;
    const depreciationPercentage = Math.round((totalDepreciatedAmount / asset.purchaseCost) * 100);
    const isFullyDepreciated = depreciationPercentage >= 100;

    return {
      ...asset,
      age: rawAge, // Display actual age, even if > 5
      bookValue,
      depreciationPercentage,
      totalDepreciatedAmount,
      isFullyDepreciated
    };
  });

  // Calculate summary stats
  const totalCost = processedData.reduce((sum, item) => sum + item.purchaseCost, 0);
  const totalBookValue = processedData.reduce((sum, item) => sum + item.bookValue, 0);
  const totalDepreciated = totalCost - totalBookValue;
  const fullyDepreciatedCount = processedData.filter(item => item.isFullyDepreciated).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-secondary">{tReport("title")}</h1>
        <Button variant="outline" className="gap-2 bg-card border-gray-200 text-content-dark hover:border-primary hover:text-primary">
          <Download size={18} />
          <span>{tReport("exportCsv")}</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tReport("totalCost")}</p>
          <p className="text-2xl font-black text-content-dark">{tDetails("currency")}{totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tReport("totalBookValue")}</p>
          <p className="text-2xl font-black text-content-dark">{tDetails("currency")}{totalBookValue.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tReport("totalDepreciated")}</p>
          <p className="text-2xl font-black text-content-dark">{tDetails("currency")}{totalDepreciated.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tReport("fullyDepreciatedCount")}</p>
          <p className="text-2xl font-black text-content-dark">{fullyDepreciatedCount}</p>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-background text-content-muted border-b border-gray-100 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-bold">{tReport("table.asset")}</th>
                <th className="px-6 py-4 font-bold">{tReport("table.purchaseCost")}</th>
                <th className="px-6 py-4 font-bold text-center">{tReport("table.age")}</th>
                <th className="px-6 py-4 font-bold">{tReport("table.bookValue")}</th>
                <th className="px-6 py-4 font-bold text-left w-1/4">{tReport("table.depreciation")}</th>
                <th className="px-6 py-4 font-bold text-center">{tReport("table.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {processedData.map((row) => {
                // Determine progress bar color based on percentage
                let barColor = "bg-primary";
                if (row.depreciationPercentage > 60 && row.depreciationPercentage < 100) {
                  barColor = "bg-status-warning";
                } else if (row.isFullyDepreciated) {
                  barColor = "bg-status-error";
                }

                return (
                  <tr key={row.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-content-dark">{row.name}</p>
                      <p className="text-xs text-content-muted">{row.purchaseDate}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-content">
                      {tDetails("currency")}{row.purchaseCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-content">
                      {row.age}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${row.isFullyDepreciated ? 'text-status-error' : 'text-content-dark'}`}>
                        {tDetails("currency")}{row.bookValue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          {row.isFullyDepreciated ? (
                            <span className="text-status-error">{tReport("fullyDepreciated")}</span>
                          ) : (
                            <span className="text-content-muted">{row.depreciationPercentage}{tReport("depreciatedLabel")}</span>
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`${barColor} h-1.5 rounded-full`} 
                            style={{ width: `${Math.min(row.depreciationPercentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 bg-background border border-gray-200 text-content-dark rounded-full text-xs font-bold">
                        {tList(`status.${row.status}` as any)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer Note */}
        <div className="p-4 bg-background border-t border-gray-100 text-xs text-content-muted">
          {tReport("formulaText")}
        </div>
      </div>

    </div>
  );
}