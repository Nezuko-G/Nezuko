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
      fallback={<div className="p-8 text-center">{t("noAccess")}</div>}
    >
      <div className="w-full max-w-6xl mx-auto space-y-6 pb-10 text-right">
        <div
          className="flex items-center gap-2 text-content-muted text-sm font-bold mb-4 cursor-pointer"
          onClick={() => router.push("/reports")}
        >
          <span>{tHub("title")}</span>
          <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
          <span className="text-primary">{t("title")}</span>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black text-secondary flex items-center gap-3">
            <Clock size={28} className="text-primary flex" />
            {t("title")}
          </h1>
          <p className="text-sm flex font-medium text-content-muted">
            {t("subtitle")}
          </p>
        </div>

        <div className="bg-card rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : !history || history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <Clock size={48} className="text-gray-300 mb-4" />
              <p className="text-sm font-bold text-content-muted">
                {t("empty")}
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-background/50 text-content-muted border-b border-gray-50 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t("table.report")}</th>
                    <th className="px-6 py-4 font-bold">{t("table.date")}</th>
                    <th className="px-6 py-4 font-bold text-center">
                      {t("table.format")}
                    </th>
                    <th className="px-6 py-4 font-bold text-center">
                      {t("table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-content-dark">
                          {tHub(`types.${item.type}.name`) || item.type}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-content-muted">
                        {new Date(item.generatedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-gray-100 text-content-dark rounded-full text-xs font-bold uppercase tracking-wider">
                          {item.format}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDownload(item)}
                            disabled={isDownloadingCsv || isDownloadingPdf}
                            className="p-2 text-content-muted hover:text-secondary hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                            title={t("table.downloadAgain")}
                          >
                            <Download size={18} />
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
