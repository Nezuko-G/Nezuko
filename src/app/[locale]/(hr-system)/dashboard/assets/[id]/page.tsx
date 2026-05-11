"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAsset, useAssetHistory } from "@/hooks/useAssets";
import AssetDetailActions from "./_components/AssetDetailActions";
import AssetModalsContainer from "../_components/modals/AssetActionModal";
import { Loader2 } from "lucide-react";

export default function AssetDetailPage() {
  const { id } = useParams();
  const tList = useTranslations("assets.list");
  const tDetails = useTranslations("assets.details");

  const { data: asset, isLoading: assetLoading } = useAsset(id as string);
  const { data: history, isLoading: historyLoading } = useAssetHistory(id as string);

  if (assetLoading || historyLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!asset) return <div className="text-center py-20 font-bold text-status-error">Asset not found</div>;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-secondary">{asset.name}</h1>
          <p className="text-sm text-content-muted">{asset.brand}</p>
        </div>
        <AssetDetailActions asset={asset} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tDetails("purchaseCost")}</p>
          <p className="text-2xl font-black text-content-dark">{tDetails("currency")}{asset.purchaseCost.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tDetails("status")}</p>
          <span className="px-3 py-1 bg-primary-light text-secondary-hover rounded-full text-sm font-bold inline-block">
            {tList(`status.${asset.status}`)}
          </span>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tDetails("condition")}</p>
          <span className="px-2 py-1 bg-status-success text-white rounded-md text-xs font-bold inline-block">
            {tList(`condition.${asset.condition}`)}
          </span>
        </div>
      </div>

      {/* History Timeline */}
    <div className="space-y-4 pt-4">
      <h2 className="text-lg font-bold text-content-dark px-1">{tDetails("historyTitle")}</h2>
      
      {!history || history.length === 0 ? (
        <div className="bg-card border border-gray-100 rounded-2xl p-8 text-center text-content-muted shadow-sm font-bold">
          {tDetails("noNotes")}
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => (
            <div key={record.id} className="relative bg-card border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            </div>
          ))}
        </div>
      )}
    </div>
      <AssetModalsContainer />
    </div>
  );
}