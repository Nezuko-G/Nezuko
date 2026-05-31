"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAssetUIStore } from "@/app/(hr-system)/asset/hooks/useAssetUIStore";
import { AssetConditionEnum } from "@/types/dto/asset.dto";
import { useAssetMutations } from "@/app/(hr-system)/asset/hooks/useAssets";
import { X, Loader2 } from "lucide-react";
import { z } from "zod";

type AssetConditionType = z.infer<typeof AssetConditionEnum>;

export default function AssetFormModal() {
  const t = useTranslations("assets.modals");
  const tList = useTranslations("assets.list");
  const { modalType, selectedAsset, closeModal } = useAssetUIStore();
  const { createAsset, updateAsset, isLoading } = useAssetMutations();

  const isCreate = modalType === "CREATE";

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    category: "",
    serialNumber: "",
    condition: "NEW" as AssetConditionType,
    purchaseCost: 0,
    purchaseDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    const func = () => {
    if (!isCreate && selectedAsset) {
      setFormData({
        name: String(selectedAsset.name || ""),
        brand: String(selectedAsset.brand || ""),
        model: String(selectedAsset.model || ""),
        category: String(selectedAsset.category || ""),
        serialNumber: String(selectedAsset.serialNumber || ""),
        condition: selectedAsset.condition as AssetConditionType,
        purchaseCost: Number(selectedAsset.purchaseCost || 0),
        purchaseDate: selectedAsset.purchaseDate
          ? String(selectedAsset.purchaseDate).split("T")[0]
          : "",
        notes: String(selectedAsset.notes || ""),
      });
    }
    }
    func();
  }, [isCreate, selectedAsset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreate) {
      createAsset.mutate({
        ...formData,
        purchaseCost: Number(formData.purchaseCost),
      });
    } else if (selectedAsset?.id) {
      updateAsset.mutate({ id: selectedAsset.id, data: formData });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-content-dark">
            {isCreate
              ? tList("registerBtn")
              : t("title.EDIT", { assetName: selectedAsset?.name || "Asset" })}
          </h2>
          <button
            onClick={closeModal}
            className="p-1.5 text-content-muted hover:text-status-error rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 flex-1 overflow-y-auto space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {tList("table.name")}
            </label>
            <input
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.brand")}
              </label>
              <input
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.model")}
              </label>
              <input
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {tList("table.category")}
              </label>
              <input
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {tList("table.serial")}
              </label>
              <input
                value={formData.serialNumber}
                onChange={(e) =>
                  setFormData({ ...formData, serialNumber: e.target.value })
                }
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.cost")}
              </label>
              <input
                type="number"
                min="0"
                value={formData.purchaseCost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchaseCost: Number(e.target.value),
                  })
                }
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.purchaseDate")}
              </label>
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseDate: e.target.value })
                }
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {tList("table.condition")}
            </label>
            <select
              value={formData.condition}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  condition: e.target.value as AssetConditionType,
                })
              }
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="NEW">{tList("condition.NEW")}</option>
              <option value="GOOD">{tList("condition.GOOD")}</option>
              <option value="FAIR">{tList("condition.FAIR")}</option>
              <option value="DAMAGED">{tList("condition.DAMAGED")}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.notes")}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-background/50 rounded-b-2xl">
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 text-content-dark font-bold hover:bg-gray-100 rounded-xl transition-colors"
          >
            {t("buttons.cancel")}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary-hover disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isCreate ? t("buttons.create") : t("buttons.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
