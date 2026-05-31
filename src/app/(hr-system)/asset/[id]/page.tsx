"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useAsset,
  useAssetHistory,
} from "@/app/(hr-system)/asset/hooks/useAssets";
import AssetDetailActions from "./_components/AssetDetailActions";
import AssetModalsContainer from "../_components/modals/AssetModalsContainer";
import { useEffect, useState } from "react";
import {
  Clock,
  UserPlus,
  Loader2,
  CalendarClock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AssetDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const tList = useTranslations("assets.list");
  const tDetails = useTranslations("assets.details");

  const { data: asset, isLoading: assetLoading } = useAsset(id as string);
  const { data: history, isLoading: historyLoading } = useAssetHistory(
    id as string,
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-status-success/10 text-status-success";
      case "ASSIGNED":
        return "bg-primary/10 text-primary";
      case "UNDER_MAINTENANCE":
        return "bg-status-warning/10 text-status-warning";
      case "RETIRED":
        return "bg-status-error/10 text-status-error";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getConditionColor = (condition: string) => {
    const cond = condition?.toUpperCase();
    switch (cond) {
      case "NEW":
      case "GOOD":
        return "bg-status-success/10 text-status-success";
      case "FAIR":
        return "bg-status-warning/10 text-status-warning";
      case "POOR":
      case "DAMAGED":
        return "bg-status-error/10 text-status-error";
      default:
        return "bg-gray-100 text-content-muted";
    }
  };

  if (assetLoading || historyLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="text-center py-20 font-bold text-status-error">
        {tDetails("notFound")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4 md:p-8 text-right">
      <div
        className="flex items-center gap-2 text-content-muted text-sm font-bold mb-1 cursor-pointer"
        onClick={() => router.push("/asset")}
      >
        <span>{tList("title")}</span>
        <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
        <span className="text-primary">{asset.name}</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold text-secondary">
            {asset.name}
          </h1>
          <p className="text-xs font-semibold text-content-muted">
            {asset.brand}
          </p>
        </div>
        <AssetDetailActions asset={asset} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-card border border-gray-100 rounded-3xl p-6 shadow-sm">
          <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-1">
            {tDetails("purchaseCost")}
          </p>
          <p className="text-2xl font-black text-secondary">
            {tDetails("currency")}
            {asset.purchaseCost.toLocaleString()}
          </p>
        </div>

        <div className="bg-card border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-2">
            {tDetails("status")}
          </p>
          <div>
            <span
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-bold inline-block",
                getStatusColor(asset.status),
              )}
            >
              {tList(`status.${asset.status}`)}
            </span>
          </div>
        </div>

        <div className="bg-card border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-2">
            {tDetails("condition")}
          </p>
          <div>
            <span
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-bold inline-block",
                getConditionColor(asset.condition),
              )}
            >
              {tList(`condition.${asset.condition}`)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h2 className="text-lg font-extrabold text-secondary px-1 flex items-center gap-2">
          <Clock size={18} className="text-primary" />
          {tDetails("historyTitle")}
        </h2>

        {!history || history.length === 0 ? (
          <div className="bg-card border border-gray-100 rounded-2xl p-12 text-center text-content-muted shadow-sm font-bold border-dashed">
            {tDetails("noNotes")}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {history.map((record) => {
  const holderName = record.userName || tDetails("unknownUser");
  const adminName = record.adminName || "";
  const displayDate = record.date;
  const initial = record.userName?.charAt(0) || "?";

  return (
    <div key={record.id} className="relative bg-card border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary-light transition-colors">
      <div className="flex items-center gap-4 text-right">
        <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center text-xl font-black shadow-inner border-2 border-white shrink-0">
          {initial}
        </div>
        <div className="space-y-0.5">
          <p className="font-extrabold text-content-dark text-base">
            {tDetails("to")}: {holderName}
          </p>
          <p className="text-xs font-bold text-content-muted flex items-center gap-1">
            <UserPlus size={14} className="text-gray-400" />
            {tDetails("by")}: <span className="text-secondary font-bold">{adminName}</span>
          </p>
        </div>
      </div>

                  <div className="flex flex-col md:items-end gap-1.5 text-right ps-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-content-muted rounded-md text-[10px] font-bold border border-gray-100">
                        <CalendarClock size={12} />
                        {isMounted && displayDate
                          ? new Date(displayDate).toLocaleDateString()
                          : "---"}
                      </span>
                    </div>

                    {record.notes && (
                      <p className="text-xs text-content-muted bg-gray-50/50 px-2.5 py-1.5 rounded-xl border-r-2 border-primary/20 max-w-[320px] font-medium">
                        "{record.notes}"
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AssetModalsContainer />
    </div>
  );
}
