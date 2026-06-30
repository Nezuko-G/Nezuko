/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getReportTypes, getReportPreview, getReportHistory, downloadReportCsv, downloadReportPdf } from "../api/reports";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export const useReportTypes = () => {
  return useQuery({
    queryKey: ["report-types"],
    queryFn: getReportTypes,
  });
};

export const useReportPreview = (type: string, params: Record<string, any>, enabled: boolean) => {
  return useQuery({
    queryKey: ["report-preview", type, params],
    queryFn: () => getReportPreview(type, params),
    enabled: enabled && !!type,
  });
};

export const useReportHistory = (allowed: boolean) => {
  return useQuery({
    queryKey: ["report-history"],
    queryFn: getReportHistory,
    enabled: allowed,
  });
};

export function useReportExport() {
  const [isDownloadingCsv, setIsDownloadingCsv] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const t = useTranslations("reports.errors");

  const triggerDownload = (blob: Blob, type: string, extension: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const date = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `${type}-report-${date}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = async (type: string, params: Record<string, any>) => {
    setIsDownloadingCsv(true);
    try {
      const blob = await downloadReportCsv(type, params);
      triggerDownload(blob, type, "csv");
    } catch {
      toast.error(t("downloadFailed"));
    } finally {
      setIsDownloadingCsv(false);
    }
  };

  const exportPdf = async (type: string, params: Record<string, any>) => {
    setIsDownloadingPdf(true);
    try {
      const blob = await downloadReportPdf(type, params);
      triggerDownload(blob, type, "pdf");
    } catch {
      toast.error(t("downloadFailed"));
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return {
    exportCsv,
    exportPdf,
    isDownloadingCsv,
    isDownloadingPdf,
  };
}