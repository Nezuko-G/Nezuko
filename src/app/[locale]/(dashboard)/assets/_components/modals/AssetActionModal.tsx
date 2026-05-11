"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAssetUIStore } from "@/hooks/useAssetUIStore";
import { AssetCondition } from "@/types/dto/asset.dto";
import { X, AlertCircle } from "lucide-react";

export default function AssetActionModal() {
  const t = useTranslations("assets.modals");
  const { isModalOpen, modalType, selectedAsset, closeModal } = useAssetUIStore();

  const [selectedUserId, setSelectedUserId] = useState("");
  const [condition, setCondition] = useState<AssetCondition | "">("");
  const [notes, setNotes] = useState("");

  if (!isModalOpen || !modalType || !selectedAsset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "ASSIGN") {
      console.log("POST /assets/:id/assign", { selectedUserId, condition, notes });
    } else if (modalType === "RETURN") {
      console.log("POST /assets/:id/return", { condition, notes });
    } else if (modalType === "TRANSFER") {
      console.log("POST /assets/:id/transfer", { selectedUserId, condition, notes });
    }
    closeModal();
  };

  const isAssign = modalType === "ASSIGN";
  const isReturn = modalType === "RETURN";
  const isTransfer = modalType === "TRANSFER";

  const getConfirmButtonText = () => {
    if (isAssign) return t("buttons.confirmAssign");
    if (isReturn) return t("buttons.confirmReturn");
    if (isTransfer) return t("buttons.confirmTransfer");
    return t("buttons.confirmAssign");
  };

  const isSubmitDisabled = () => {
    if (isAssign && (!selectedUserId || !condition)) return true;
    if (isReturn && !condition) return true;
    if (isTransfer && (!selectedUserId || !condition)) return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-content-dark">
            {t(`title.${modalType}`, { assetName: selectedAsset.name })}
          </h2>
          <button
            onClick={closeModal}
            className="p-1.5 text-content-muted hover:text-status-error hover:bg-status-error/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-6">
          {isTransfer && (
            <div className="bg-status-warning/10 border border-status-warning/20 p-4 rounded-xl flex gap-3 text-status-warning">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium leading-relaxed">
                {t("warnings.atomicTransfer")}
              </p>
            </div>
          )}

          {(isReturn || isTransfer) && selectedAsset.currentHolder && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">{t("fields.currentHolder")}</label>
              <div className="flex items-center justify-between bg-background border border-gray-200 px-4 py-3 rounded-xl opacity-70">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-bold">
                    {selectedAsset.currentHolder.name.charAt(0)}
                  </div>
                  <span className="font-medium text-content-dark">{selectedAsset.currentHolder.name}</span>
                </div>
                <span className="text-xs text-content-muted">{t("readonly")}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {isAssign ? t("fields.conditionOut") : isReturn ? t("fields.conditionIn") : t("fields.conditionOnReturn")} <span className="text-status-error">*</span>
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as AssetCondition)}
                className="w-full bg-background border border-gray-200 text-content rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              >
                <option value="" disabled>--</option>
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
                <option value="DAMAGED">Damaged</option>
              </select>
            </div>

            {(isAssign || isTransfer) && (
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-content-dark">
                  {isTransfer ? t("fields.transferTo") : t("fields.selectEmployee")} <span className="text-status-error">*</span>
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full bg-background border border-gray-200 text-content rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                >
                  <option value="" disabled>--</option>
                  <option value="user_1">Ahmed Hassan</option>
                  <option value="user_2">Sara R.</option>
                </select>
                <p className="text-xs text-content-muted px-1">{t("sameTenantHint")}</p>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">{t("fields.notes")}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="..."
              className="w-full bg-background border border-gray-200 text-content placeholder:text-content-muted rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
            />
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-background/50 rounded-b-2xl">
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 text-content-dark hover:bg-gray-200 rounded-xl text-sm font-bold transition-colors"
          >
            {t("buttons.cancel")}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className="px-5 py-2.5 bg-secondary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-hover rounded-xl text-sm font-bold transition-all"
          >
            {getConfirmButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}