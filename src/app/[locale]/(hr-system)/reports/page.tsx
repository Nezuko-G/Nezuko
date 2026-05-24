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
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  const reports = types || [];

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 md:p-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold text-secondary">
            {t("title")}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <RoleGuard allowedRoles={["HR", "TENANT_OWNER"]}>
            <button
              onClick={() => router.push("/reports/history")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-card text-secondary font-bold text-sm shadow-sm hover:bg-gray-50 transition"
            >
              <Clock size={16} />
              {t("historyBtn")}
            </button>
          </RoleGuard>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {reports.map((report) => (
            <div
              key={report.key}
              className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full hover:border-primary/30 transition-all group"
            >
              <div className="flex-1 space-y-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <FileText size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-secondary">
                    {t(`types.${report.key}.name`)}
                  </h3>
                  <p className="text-sm text-content-muted leading-relaxed text-start w-full">
                    {t(`types.${report.key}.description`)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.supportedFilters.map((filter) => (
                    <span
                      key={filter}
                      className="px-2 py-0.5 bg-gray-50 text-content-muted rounded-md text-[10px] font-bold uppercase border border-gray-100"
                    >
                      {tFilters(filter)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-gray-50">
                <button
                  onClick={() => router.push(`/reports/${report.key}`)}
                  className="w-full py-2.5 bg-gray-50 text-secondary font-bold text-sm rounded-xl group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  {t("generateBtn")}
                  <ChevronLeft
                    size={16}
                    className="rtl:rotate-0 ltr:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1"
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
