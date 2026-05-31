"use client";

import { useTranslations } from "next-intl";
import { useAssetUIStore } from "@/app/(hr-system)/asset/hooks/useAssetUIStore";
import { Asset } from "@/types/dto/asset.dto";
import { ArrowRightLeft, CornerDownLeft, Edit2, UserPlus } from "lucide-react";

export default function AssetDetailActions({ asset }: { asset: Asset }) {
  const t = useTranslations("assets.modals");
  const { openModal } = useAssetUIStore();

  return (
    <div className="flex items-center gap-3">
      {asset.status === "AVAILABLE" && (
        <button
          onClick={() => openModal("ASSIGN", asset)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-card text-content-dark hover:border-primary hover:text-primary rounded-xl text-sm font-bold transition-all"
        >
          <UserPlus size={16} />
          <span>{t("buttons.confirmAssign")}</span>
        </button>
      )}

      {asset.status === "ASSIGNED" && (
        <>
          <button
            onClick={() => openModal("TRANSFER", asset)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-card text-content-dark hover:border-primary hover:text-primary rounded-xl text-sm font-bold transition-all"
          >
            <ArrowRightLeft size={16} />
            <span>{t("buttons.confirmTransfer")}</span>
          </button>
          <button
            onClick={() => openModal("RETURN", asset)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-card text-content-dark hover:border-status-warning hover:text-status-warning rounded-xl text-sm font-bold transition-all"
          >
            <CornerDownLeft size={16} />
            <span>{t("buttons.confirmReturn")}</span>
          </button>
        </>
      )}

      <button
        onClick={() => openModal("EDIT", asset)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-card text-content-dark hover:border-secondary hover:text-secondary rounded-xl text-sm font-bold transition-all"
      >
        <Edit2 size={16} />
        <span>{t("title.EDIT", { assetName: "" }).split(" — ")[0]}</span>
      </button>
    </div>
  );
}
