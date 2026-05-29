"use client";

import { useTranslations } from "next-intl";
import { AssetDTO } from "@/types/dto/asset.dto";
import { useAssetUIStore } from "@/app/[locale]/(hr-system)/asset/hooks/useAssetUIStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ArrowRightLeft, CornerDownLeft, UserPlus, Pencil } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { z } from "zod";
import { cn } from "@/lib/utils";

type Asset = z.infer<typeof AssetDTO>;

interface AssetTableProps {
  assets: Asset[];
  isReadOnly?: boolean;
}

export default function AssetTable({
  assets,
  isReadOnly = false,
}: AssetTableProps) {
  const t = useTranslations("assets.list");
  const { openModal } = useAssetUIStore();
  const { role } = useAuthStore();
  const actuallyReadOnly = isReadOnly || role !== "HR";
  const router = useRouter();

  const getStatusColor = (status: Asset["status"]) => {
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

  const getConditionColor = (condition: Asset["condition"]) => {
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

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
            <th className="px-5 py-4 text-right">{t("table.name")}</th>
            <th className="px-5 py-4 text-right">{t("table.category")}</th>
            <th className="px-5 py-4 text-right">{t("table.serial")}</th>
            <th className="px-5 py-4 text-center">{t("table.status")}</th>
            <th className="px-5 py-4 text-center">{t("table.condition")}</th>
            {!actuallyReadOnly && (
              <th className="px-5 py-4 text-left ps-8">{t("table.actions")}</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {assets.map((asset) => {
            const safeCondition = asset.condition?.toUpperCase() || "UNKNOWN";

            return (
              <tr
                key={asset.id}
                onClick={() => router.push(`/asset/${asset.id}`)}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors cursor-pointer"
              >
                <td className="px-5 py-4">
                  <div className="flex flex-col">
                    <p className="font-semibold text-secondary">{asset.name}</p>
                    <p className="text-content-muted text-xs">{asset.brand}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2.5 py-1 rounded-md bg-gray-50 text-content-dark text-xs font-semibold border border-gray-100">
                    {asset.category}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-content-muted">
                    {asset.serialNumber || "—"}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold",
                      getStatusColor(asset.status),
                    )}
                  >
                    {t(`status.${asset.status}`)}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-bold",
                      getConditionColor(asset.condition),
                    )}
                  >
                    {asset.condition
                      ? t(`condition.${safeCondition}`) ===
                        `assets.list.condition.${safeCondition}`
                        ? safeCondition
                        : t(`condition.${safeCondition}`)
                      : "—"}
                  </span>
                </td>

                {!actuallyReadOnly && (
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 ps-3">
                      {asset.status === "AVAILABLE" && (
                        <button
                          title={t("actions.assign")}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal("ASSIGN", asset);
                          }}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-content-muted hover:text-primary transition-colors"
                        >
                          <UserPlus size={15} />
                        </button>
                      )}
                      {asset.status === "ASSIGNED" && (
                        <>
                          <button
                            title={t("actions.return")}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal("RETURN", asset);
                            }}
                            className="p-1.5 rounded-lg hover:bg-status-warning/10 text-content-muted hover:text-status-warning transition-colors"
                          >
                            <CornerDownLeft size={15} />
                          </button>
                          <button
                            title={t("actions.transfer")}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal("TRANSFER", asset);
                            }}
                            className="p-1.5 rounded-lg hover:bg-primary/10 text-content-muted hover:text-primary transition-colors"
                          >
                            <ArrowRightLeft size={15} />
                          </button>
                        </>
                      )}
                      <button
                        title={t("actions.edit")}
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal("EDIT", asset);
                        }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted hover:text-secondary transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
