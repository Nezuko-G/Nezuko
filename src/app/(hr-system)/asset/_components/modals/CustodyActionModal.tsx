"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAssetUIStore } from "@/app/(hr-system)/asset/hooks/useAssetUIStore";
import { AssetConditionEnum } from "../../types/asset.dto";
import { useAssetMutations } from "@/app/(hr-system)/asset/hooks/useAssets";
import { useEmployees } from "@/hooks/use-employee";
import { X, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import { z } from "zod";

type AssetConditionType = z.infer<typeof AssetConditionEnum>;

export default function CustodyActionModal() {
  const t = useTranslations("assets.modals");
  const tList = useTranslations("assets.list");
  const { modalType, selectedAsset, closeModal } = useAssetUIStore();
  const { assignAsset, returnAsset, transferAsset, isLoading } =
    useAssetMutations();
  const { data: employees, isLoading: employeesLoading } = useEmployees();

  const isAssign = modalType === "ASSIGN";
  const isReturn = modalType === "RETURN";
  const isTransfer = modalType === "TRANSFER";

  const [formData, setFormData] = useState({
    condition: "" as AssetConditionType | "",
    employeeId: "",
    notes: "",
  });

  useEffect(() => {
    const func = () => {
    if (selectedAsset) {
      setFormData({
        condition: selectedAsset.condition as AssetConditionType,
        employeeId: "",
        notes: "",
      });
    }
    }
    func();
  }, [selectedAsset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = selectedAsset?.id;
    if (!id) return;

    if (isAssign) {
      assignAsset.mutate({
        id,
        data: {
          userId: formData.employeeId,
          conditionOut: formData.condition as AssetConditionType,
          notes: formData.notes,
        },
      });
    } else if (isReturn) {
      returnAsset.mutate({
        id,
        data: {
          conditionIn: formData.condition as AssetConditionType,
          notes: formData.notes,
        },
      });
    } else if (isTransfer) {
      transferAsset.mutate({
        id,
        data: {
          toUserId: formData.employeeId,
          conditionOut: formData.condition as AssetConditionType,
          notes: formData.notes,
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-content-dark">
            {t(`title.${modalType}`, { assetName: selectedAsset?.name || "Asset" })}
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
          {isTransfer && (
            <div className="bg-status-warning/10 border border-status-warning/20 p-4 rounded-xl flex gap-3 text-status-warning">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-start leading-relaxed">
                {t("warnings.atomicTransfer")}
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {tList("table.condition")}
            </label>
            <div className="relative">
              <select
                value={formData.condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    condition: e.target.value as AssetConditionType,
                  })
                }
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none appearance-none"
              >
                <option value="NEW">{tList("condition.NEW")}</option>
                <option value="GOOD">{tList("condition.GOOD")}</option>
                <option value="FAIR">{tList("condition.FAIR")}</option>
                <option value="DAMAGED">{tList("condition.DAMAGED")}</option>
              </select>
              <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-content-muted">
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          {(isAssign || isTransfer) && (
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.selectEmployee")}
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  disabled={employeesLoading}
                  className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none appearance-none disabled:opacity-50"
                >
                  <option value="" disabled>
                    {employeesLoading
                      ? t("states.loadingEmployees")
                      : t("fields.selectEmployee")}
                  </option>
                  {employees?.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
                <div className="absolute end-4 top-1/2 -translate-y-1/2 pointer-events-none text-content-muted">
                  {employeesLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </div>
              </div>
            </div>
          )}

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
            disabled={
              isLoading || ((isAssign || isTransfer) && !formData.employeeId)
            }
            className="px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary-hover disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isTransfer ? t("buttons.confirmTransfer") : t("buttons.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
