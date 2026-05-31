"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useReportTypes,
  useReportPreview,
  useReportExport,
} from "@/app/(hr-system)/reports/hooks/useReports";
import { reportColumnsConfig } from "@/app/(hr-system)/reports/_config/reportColumns";
import ReportFilterBar from "../_components/ReportFilterBar";
import ReportPreviewTable from "../_components/ReportPreviewTable";
import {
  Loader2,
  Download,
  FileText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export default function ReportGeneratorPage() {
  const { type } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("reports.generator");
  const tHub = useTranslations("reports.hub");

  const { data: typesData } = useReportTypes();
  const { exportCsv, exportPdf, isDownloadingCsv, isDownloadingPdf } =
    useReportExport();

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [isPreviewEnabled, setIsPreviewEnabled] = useState(false);
  const limit = 20;

  const reportConfig = typesData?.find((r) => r.key === type);
  const columns =
    typeof type === "string" ? reportColumnsConfig[type] || [] : [];

  useEffect(() => {
    if (searchParams.toString().length > 0) {
      const initialFilters: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        initialFilters[key] = value;
      });
      setFilters(initialFilters);
    }
  }, [searchParams]);

  const { data: previewResponse, isLoading: isPreviewLoading } =
    useReportPreview(
      type as string,
      { ...filters, page, limit },
      isPreviewEnabled,
    );

  const handleGenerate = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(1);
    setIsPreviewEnabled(true);
  };

  const previewData = previewResponse?.data || [];
  const meta = previewResponse?.meta;
  const lastPage = meta?.totalPages || 1;
  const canExport = previewData.length > 0 && isPreviewEnabled;

  if (!reportConfig) return null;

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 md:p8 text-right">
      <div
        className="flex items-center gap-2 text-content-muted text-sm font-bold mb-1 cursor-pointer"
        onClick={() => router.push("/reports")}
      >
        <span>{tHub("title")}</span>
        <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
        <span className="text-primary">{tHub(`types.${type}.name`)}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold text-secondary">
            {tHub(`types.${type}.name`)}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => exportCsv(type as string, filters)}
            disabled={!canExport || isDownloadingCsv}
            title={!canExport ? t("exportDisabledTooltip") : ""}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-card text-secondary font-bold text-sm shadow-sm hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingCsv ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            <span>CSV</span>
          </button>

          <button
            onClick={() => exportPdf(type as string, filters)}
            disabled={!canExport || isDownloadingPdf}
            title={!canExport ? t("exportDisabledTooltip") : ""}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-secondary font-bold text-sm shadow hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingPdf ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileText size={16} />
            )}
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="pt-2">
        <ReportFilterBar
          supportedFilters={reportConfig.supportedFilters}
          initialFilters={filters}
          isLoading={isPreviewLoading}
          onGenerate={handleGenerate}
        />
      </div>

      <div
        className={`rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col ${isPreviewLoading || previewData.length === 0 ? "bg-card" : ""}`}
      >
        {isPreviewLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : (
          <>
            <div className="flex-1">
              <ReportPreviewTable columns={columns} data={previewData} />
            </div>

            {lastPage > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-center gap-4 bg-gray-50/50">
                <p className="text-sm text-content-muted font-bold">
                  {t("pagination", { current: page, total: lastPage })}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
