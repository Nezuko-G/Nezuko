"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useAsset,
  useAssetHistory,
} from "@/app/[locale]/(hr-system)/asset/hooks/useAssets";
import AssetDetailActions from "./_components/AssetDetailActions";
import AssetModalsContainer from "../_components/modals/AssetModalsContainer";
import { useEffect, useState } from "react";
import {
  Clock,
  UserPlus,
  Loader2,
  CalendarClock,
} from "lucide-react";

export default function AssetDetailPage() {
  const { id } = useParams();
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

  if (assetLoading || historyLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
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
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-secondary">{asset.name}</h1>
          <p className="text-sm text-content-muted">{asset.brand}</p>
        </div>
        <AssetDetailActions asset={asset} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">
            {tDetails("purchaseCost")}
          </p>
          <p className="text-2xl font-black text-content-dark">
            {tDetails("currency")}
            {asset.purchaseCost.toLocaleString()}
          </p>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">
            {tDetails("status")}
          </p>
          <span className="px-3 py-1 bg-primary-light text-secondary-hover rounded-full text-sm font-bold inline-block">
            {tList(`status.${asset.status}`)}
          </span>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">
            {tDetails("condition")}
          </p>
          <span
            className={`px-2 py-1 rounded-md text-xs font-bold inline-block ${
              asset.condition === "NEW"
                ? "bg-status-success text-white"
                : "bg-status-warning text-white"
            }`}
          >
            {tList(`condition.${asset.condition}`)}
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-black text-secondary px-1 flex items-center gap-2">
          <Clock size={20} className="text-primary" />
          {tDetails("historyTitle")}
        </h2>

        {!history || history.length === 0 ? (
          <div className="bg-card border border-gray-100 rounded-2xl p-10 text-center text-content-muted shadow-sm font-bold border-dashed">
            {tDetails("noNotes")}
          </div>
        ) : (
          <div className="space-y-3">
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

      <div className="flex flex-col md:items-end gap-2 text-right">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-content-muted rounded-full text-[11px] font-bold border border-gray-100">
            <CalendarClock size={14} />
            {isMounted && displayDate ? new Date(displayDate).toLocaleDateString() : "---"}
          </span>
        </div>

        {record.notes && (
          <p className="text-xs italic text-content-muted bg-gray-50/50 p-2.5 rounded-xl border-l-2 border-primary/20 max-w-[300px]">
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
