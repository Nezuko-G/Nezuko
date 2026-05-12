"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useAssetUIStore } from "@/app/[locale]/(hr-system)/asset/hooks/useAssetUIStore";
import { UpdateAssetDTO } from "@/types/dto/asset.dto";
import { useAssetMutations } from "@/app/[locale]/(hr-system)/asset/hooks/useAssets";
import { X } from "lucide-react";
import { z } from "zod";

export default function EditModal() {
  const t = useTranslations("assets.modals");
  const tList = useTranslations("assets.list");
  const { selectedAsset, closeModal } = useAssetUIStore();
  const { updateAsset, isLoading } = useAssetMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof UpdateAssetDTO>>({
    resolver: zodResolver(UpdateAssetDTO),
  });

  useEffect(() => {
    if (selectedAsset) {
      reset({
        name: selectedAsset.name,
        brand: selectedAsset.brand,
        category: selectedAsset.category,
        serialNumber: selectedAsset.serialNumber,
        condition: selectedAsset.condition,
        purchaseCost: selectedAsset.purchaseCost,
        purchaseDate: selectedAsset.purchaseDate,
      });
    }
  }, [selectedAsset, reset]);

  if (!selectedAsset) return null;

  const onSubmit = (data: z.infer<typeof UpdateAssetDTO>) => {
    updateAsset.mutate({ id: selectedAsset.id, data });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-content-dark">
            {t("title.EDIT", { assetName: selectedAsset.name })}
          </h2>
          <button
            onClick={closeModal}
            className="p-1.5 text-content-muted hover:text-status-error hover:bg-status-error/10 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-5 flex-1 overflow-y-auto space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {tList("table.name")}
            </label>
            <input
              {...register("name")}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {tList("table.category")}
              </label>
              <input
                {...register("category")}
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {tList("table.serial")}
              </label>
              <input
                {...register("serialNumber")}
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {tList("table.condition")}
            </label>
            <select
              {...register("condition")}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="NEW">New</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
              <option value="DAMAGED">Damaged</option>
            </select>
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-background/50 rounded-b-2xl">
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 text-content-dark font-bold"
          >
            {t("buttons.cancel")}
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary-hover disabled:opacity-50"
          >
            {isLoading ? "..." : tList("table.actions")}
          </button>
        </div>
      </div>
    </div>
  );
}
