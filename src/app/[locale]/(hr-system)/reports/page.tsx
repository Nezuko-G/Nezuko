"use client";

import { useTranslations } from "next-intl";
import { useReportTypes } from "@/app/[locale]/(hr-system)/reports/hooks/useReports";
import { Loader2, FileText, ChevronLeft, Clock } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

export default function ReportsHubPage() {
  const t = useTranslations("reports.hub");
  const tFilters = useTranslations("reports.filters");
  const router = useRouter();
  const { data: types, isLoading } = useReportTypes();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  const reports = types || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-10 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl flex font-black text-secondary">
            {t("title")}
          </h1>
          <p className="text-sm flex font-medium text-content-muted">
            {t("subtitle")}
          </p>
        </div>
        <RoleGuard allowedRoles={["HR", "TENANT_OWNER"]}>
          <button
            onClick={() => router.push("/reports/history")}
            className="px-5 py-2.5 bg-card border border-gray-200 text-content-dark rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Clock size={18} />
            {t("historyBtn")}
          </button>
        </RoleGuard>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-3xl border border-dashed border-gray-200">
          <FileText size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-content-dark">
            {t("emptyTitle")}
          </h3>
          <p className="text-sm text-content-muted mt-1">{t("emptyMessage")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.key}
              className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full hover:border-primary/30 transition-all group"
            >
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl flex font-black text-secondary">
                    {t(`types.${report.key}.name`)}
                  </h3>
                  <p className="text-sm text-content-muted mt-1 leading-relaxed text-start w-full">
                    {t(`types.${report.key}.description`)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {report.supportedFilters.map((filter) => (
                    <span
                      key={filter}
                      className="px-2.5 py-1 bg-gray-50 text-content-muted rounded-md text-[10px] font-bold uppercase tracking-wider border border-gray-100"
                    >
                      {tFilters(filter)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-gray-50">
                <button
                  onClick={() => router.push(`/reports/${report.key}`)}
                  className="w-full py-3 bg-gray-50 text-secondary font-bold rounded-xl group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {t("generateBtn")}
                  <ChevronLeft
                    size={18}
                    className="rtl:rotate-0 ltr:rotate-180"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
