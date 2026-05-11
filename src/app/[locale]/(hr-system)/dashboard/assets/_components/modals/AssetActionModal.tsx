"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAssetUIStore } from "@/hooks/useAssetUIStore";
import { AssetConditionEnum } from "@/types/dto/asset.dto";
import { useAssetMutations } from "@/hooks/useAssets";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { z } from "zod";

type AssetConditionType = z.infer<typeof AssetConditionEnum>;

export default function AssetActionModal() {
  const t = useTranslations("assets.modals");
  const tList = useTranslations("assets.list");
  const { isModalOpen, modalType, selectedAsset, closeModal } = useAssetUIStore();
  const { assignAsset, returnAsset, transferAsset, updateAsset, createAsset, isLoading } = useAssetMutations();

 const [formData, setFormData] = useState({
  name: "", brand: "", model: "", category: "", serialNumber: "",
  condition: "" as AssetCondition | "",
  purchaseCost: 0, purchaseDate: "", employeeId: "", notes: ""
});

 useEffect(() => {
  if (isModalOpen) {
    if ((modalType === "EDIT" || modalType === "ASSIGN") && selectedAsset) {
      setFormData({ 
        name: String(selectedAsset.name || ""),
        brand: String(selectedAsset.brand || ""),
        model: String(selectedAsset.model || ""),
        category: String(selectedAsset.category || ""),
        serialNumber: String(selectedAsset.serialNumber || ""),
        condition: selectedAsset.condition as AssetCondition,
        purchaseCost: Number(selectedAsset.purchaseCost || 0),
        purchaseDate: selectedAsset.purchaseDate ? String(selectedAsset.purchaseDate).split('T')[0] : "",
        employeeId: String(selectedAsset.currentHolder?.id || ""),
        notes: String(selectedAsset.notes || "")
      });
    } else if (modalType === "CREATE") {
      setFormData({
        name: "", brand: "", model: "", category: "", serialNumber: "",
        condition: "NEW", purchaseCost: 0, purchaseDate: new Date().toISOString().split('T')[0],
        employeeId: "", notes: ""
      });
    }
  }
}, [isModalOpen, modalType, selectedAsset]);
  if (!isModalOpen || !modalType) return null;

  const isCreate = modalType === "CREATE";
  const isEdit = modalType === "EDIT";
  const isAssign = modalType === "ASSIGN";
  const isReturn = modalType === "RETURN";
  const isTransfer = modalType === "TRANSFER";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = selectedAsset?.id;

    if (isCreate) {
      createAsset.mutate({
        name: formData.name,
        brand: formData.brand,
        model: formData.model,
        category: formData.category,
        serialNumber: formData.serialNumber,
        condition: formData.condition as AssetConditionType,
        purchaseCost: Number(formData.purchaseCost),
        purchaseDate: formData.purchaseDate,
        notes: formData.notes
      });
    } else if (isEdit) {
      updateAsset.mutate({ id, data: formData });
    } else if (isAssign) {
      assignAsset.mutate({ id, data: { employeeId: formData.employeeId, conditionOut: formData.condition as AssetConditionType, notes: formData.notes } });
    } else if (isReturn) {
      returnAsset.mutate({ id, data: { conditionIn: formData.condition as AssetConditionType, notes: formData.notes } });
    } else if (isTransfer) {
      transferAsset.mutate({ id, data: { employeeId: formData.employeeId, conditionIn: formData.condition as AssetConditionType, notes: formData.notes } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-content-dark">
            {isCreate ? tList("registerBtn") : t(`title.${modalType}`, { assetName: selectedAsset?.name })}
          </h2>
          <button onClick={closeModal} className="p-1.5 text-content-muted hover:text-status-error rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          {(isCreate || isEdit) && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-content-dark">{tList("table.name")}</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-content-dark">Brand</label>
                  <input value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-content-dark">Model</label>
                  <input value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-content-dark">{tList("table.category")}</label>
                  <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-content-dark">{tList("table.serial")}</label>
                  <input value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-content-dark">Cost ($)</label>
                  <input type="number" value={formData.purchaseCost} onChange={e => setFormData({...formData, purchaseCost: Number(e.target.value)})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-content-dark">Purchase Date</label>
                  <input type="date" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
                </div>
              </div>
            </>
          )}

          {!isEdit && !isCreate && isTransfer && (
            <div className="bg-status-warning/10 border border-status-warning/20 p-4 rounded-xl flex gap-3 text-status-warning">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">{t("warnings.atomicTransfer")}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">{tList("table.condition")}</label>
              <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value as AssetConditionType})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
                <option value="DAMAGED">Damaged</option>
              </select>
            </div>
            {(isAssign || isTransfer) && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-content-dark">{t("fields.selectEmployee")}</label>
                <select value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
                  <option value="">--</option>
                  <option value="user_1">Ahmed Hassan</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none" />
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-background/50 rounded-b-2xl">
          <button type="button" onClick={closeModal} className="px-5 py-2.5 text-content-dark font-bold">
            Cancel
          </button>
          <button type="submit" onClick={handleSubmit} disabled={isLoading} className="px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary-hover disabled:opacity-50 flex items-center gap-2">
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isCreate ? "Create Asset" : isEdit ? "Save Changes" : "Confirm Action"}
          </button>
        </div>
      </div>
    </div>
  );
}