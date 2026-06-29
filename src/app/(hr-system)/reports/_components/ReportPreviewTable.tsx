/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTranslations } from "next-intl";
import { FileSearch } from "lucide-react";

interface ReportPreviewTableProps {
  columns: string[];
  data: Record<string, any>[];
}

export default function ReportPreviewTable({
  columns,
  data,
}: ReportPreviewTableProps) {
  const t = useTranslations("reports.columns");
  const tEmpty = useTranslations("reports.preview");

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-3xl border border-dashed border-gray-200">
        <FileSearch size={48} className="text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-content-dark">
          {tEmpty("emptyTitle")}
        </h3>
        <p className="text-sm text-content-muted mt-1">
          {tEmpty("emptyMessage")}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto bg-card rounded-3xl shadow-sm border border-gray-100">
      <table className="w-full text-sm text-right">
        <thead className="bg-background/50 text-content-muted border-b border-gray-50 uppercase text-xs">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-6 py-4 font-bold whitespace-nowrap">
                {t(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-6 py-4 text-content-dark font-medium whitespace-nowrap"
                >
                  {row[col] !== null && row[col] !== undefined
                    ? String(row[col])
                    : "---"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
