"use client";

import { useTranslations } from "next-intl";
import { AssetDTO } from "@/types/dto/asset.dto";
import { useAssetUIStore } from "@/app/[locale]/(hr-system)/asset/hooks/useAssetUIStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ArrowRightLeft, CornerDownLeft, UserPlus, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AssetTableProps {
  assets: AssetDTO[];
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

  const getStatusColor = (status: AssetDTO["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-status-success/10 text-status-success";
      case "ASSIGNED":
        return "bg-primary-light text-secondary-hover";
      case "UNDER_MAINTENANCE":
        return "bg-status-warning/10 text-status-warning";
      case "RETIRED":
        return "bg-status-error/10 text-status-error";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getConditionColor = (condition: AssetDTO["condition"]) => {
    switch (condition) {
      case "NEW":
      case "GOOD":
        return "bg-status-success text-white";
      case "FAIR":
        return "bg-status-warning text-white";
      case "POOR":
      case "DAMAGED":
        return "bg-status-error text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="w-full overflow-x-auto bg-card rounded-2xl shadow-sm border border-gray-100">
      <table className="w-full text-sm text-right">
        <thead className="bg-background text-content-muted border-b border-gray-100 uppercase text-xs">
          <tr>
            <th className="px-6 py-4 font-bold">{t("table.name")}</th>
            <th className="px-6 py-4 font-bold">{t("table.category")}</th>
            <th className="px-6 py-4 font-bold">{t("table.serial")}</th>
            <th className="px-6 py-4 font-bold text-center">
              {t("table.status")}
            </th>
            <th className="px-6 py-4 font-bold text-center">
              {t("table.condition")}
            </th>
            <th className="px-6 py-4 font-bold">{t("table.assignedTo")}</th>
            {!actuallyReadOnly && (
              <th className="px-6 py-4 font-bold text-center">
                {t("table.actions")}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {assets.map((asset) => (
            <tr
              key={asset.id}
              onClick={() => router.push(`/asset/${asset.id}`)}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4">
                <p className="font-bold text-content-dark">{asset.name}</p>
                <p className="text-xs text-content-muted">{asset.brand}</p>
              </td>
              <td className="px-6 py-4 text-content font-medium">
                {asset.category}
              </td>
              <td className="px-6 py-4 text-content font-mono text-xs">
                {asset.serialNumber || "—"}
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(asset.status)}`}
                >
                  {t(`status.${asset.status}`)}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-bold ${getConditionColor(asset.condition)}`}
                >
                  {t(`condition.${asset.condition}`)}
                </span>
              </td>
              <td className="px-6 py-4">
                {asset.currentHolder ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-bold">
                      {asset.currentHolder.name.charAt(0)}
                    </div>
                    <span className="font-medium text-content-dark">
                      {asset.currentHolder.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-content-muted">—</span>
                )}
              </td>
              {!actuallyReadOnly && (
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {asset.status === "AVAILABLE" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal("ASSIGN", asset);
                        }}
                        className="p-2 text-content hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                      >
                        <UserPlus size={16} />
                      </button>
                    )}
                    {asset.status === "ASSIGNED" && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal("RETURN", asset);
                          }}
                          className="p-2 text-content hover:text-status-warning hover:bg-status-warning/10 rounded-lg transition-colors"
                        >
                          <CornerDownLeft size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal("TRANSFER", asset);
                          }}
                          className="p-2 text-content hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                        >
                          <ArrowRightLeft size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("EDIT", asset);
                      }}
                      className="p-2 text-content hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
