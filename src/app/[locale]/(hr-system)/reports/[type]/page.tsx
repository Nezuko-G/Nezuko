"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useReportTypes,
  useReportPreview,
  useReportExport,
} from "@/app/[locale]/(hr-system)/reports/hooks/useReports";
import { reportColumnsConfig } from "@/app/[locale]/(hr-system)/reports/_config/reportColumns";
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
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-10 text-right">
      <div
        className="flex items-center gap-2 text-content-muted text-sm font-bold mb-4 cursor-pointer"
        onClick={() => router.push("/reports")}
      >
        <span>{tHub("title")}</span>
        <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
        <span className="text-primary">{tHub(`types.${type}.name`)}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl flex font-black text-secondary">
            {tHub(`types.${type}.name`)}
          </h1>
          <p className="text-sm flex font-medium text-content-muted">
            {tHub(`types.${type}.description`)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportCsv(type as string, filters)}
            disabled={!canExport || isDownloadingCsv}
            title={!canExport ? t("exportDisabledTooltip") : ""}
            className="px-5 py-2.5 bg-card border border-gray-200 text-content-dark rounded-xl text-sm font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingCsv ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            CSV
          </button>
          <button
            onClick={() => exportPdf(type as string, filters)}
            disabled={!canExport || isDownloadingPdf}
            title={!canExport ? t("exportDisabledTooltip") : ""}
            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloadingPdf ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileText size={16} />
            )}
            PDF
          </button>
        </div>
      </div>

      <ReportFilterBar
        supportedFilters={reportConfig.supportedFilters}
        initialFilters={filters}
        isLoading={isPreviewLoading}
        onGenerate={handleGenerate}
      />

      <div
        className={`rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col ${isPreviewLoading || previewData.length === 0 ? "bg-card min-h-[400px]" : ""}`}
      >
        {" "}
        {isPreviewLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-x-auto">
              <ReportPreviewTable columns={columns} data={previewData} />
            </div>
            {lastPage > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                <p className="text-sm text-content-muted font-bold">
                  {t("pagination", { current: page, total: lastPage })}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-200 border border-gray-200 bg-white disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-gray-200 border border-gray-200 bg-white disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
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
