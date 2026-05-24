"use client";

import { useTranslations } from "next-intl";
import {
  useReportHistory,
  useReportExport,
} from "@/app/[locale]/(hr-system)/reports/hooks/useReports";
import {
  Loader2,
  Clock,
  Download,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

export default function ReportHistoryPage() {
  const t = useTranslations("reports.history");
  const tHub = useTranslations("reports.hub");
  const router = useRouter();
  const { data: history, isLoading } = useReportHistory(true);
  const { exportCsv, exportPdf, isDownloadingCsv, isDownloadingPdf } =
    useReportExport();
    
  const handleDownload = (item: any) => {
    if (item.format.toLowerCase() === "pdf") {
      exportPdf(item.type, item.filters || {});
    } else {
      exportCsv(item.type, item.filters || {});
    }
  };

  return (
    <RoleGuard
      allowedRoles={["HR", "TENANT_OWNER"]}
      fallback={
        <div className="p-8 text-center font-bold text-status-error">
          {t("noAccess")}
        </div>
      }
    >
      <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4 md:p-8 text-right">
        <div
          className="flex items-center gap-2 text-content-muted text-sm font-bold mb-1 cursor-pointer"
          onClick={() => router.push("/reports")}
        >
          <span>{tHub("title")}</span>
          <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
          <span className="text-primary">{t("title")}</span>
        </div>

        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold text-secondary flex items-center gap-2">
            <Clock size={24} className="text-primary" />
            {t("title")}
          </h1>
        </div>

        <div
          className={`overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm flex flex-col ${isLoading || !history || history.length === 0 ? "min-h-[400px]" : ""}`}
        >
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={36} />
            </div>
          ) : !history || history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <Clock size={48} className="text-gray-300 mb-4" />
              <p className="text-sm font-bold text-content-muted">
                {t("empty")}
              </p>
            </div>
          ) : (
            <div className="flex-1">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
                    <th className="px-5 py-4 text-right">
                      {t("table.report")}
                    </th>
                    <th className="px-5 py-4 text-right">{t("table.date")}</th>
                    <th className="px-5 py-4 text-center">
                      {t("table.format")}
                    </th>
                    <th className="px-5 py-4 text-left pl-8">
                      {t("table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-secondary">
                          {tHub(`types.${item.type}.name`) || item.type}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-content-muted">
                          {new Date(item.generatedAt).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="px-2.5 py-1 bg-gray-50 text-content-dark border border-gray-100 rounded-md text-xs font-bold uppercase tracking-wider">
                          {item.format}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 pl-3">
                          <button
                            onClick={() => handleDownload(item)}
                            disabled={isDownloadingCsv || isDownloadingPdf}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted hover:text-secondary transition-colors disabled:opacity-50"
                            title={t("table.downloadAgain") || "Download"}
                          >
                            <Download size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
