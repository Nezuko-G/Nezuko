"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useInsuranceUIStore } from "@/app/(hr-system)/insurance/hooks/useInsuranceUIStore";
import { useInsuranceMutations } from "@/app/(hr-system)/insurance/hooks/useInsurance";
import { CreateInsurancePlanDTO } from "../../types/insurance.dto";
import { X, Loader2 } from "lucide-react";
import { z } from "zod";

export default function PlanDrawer() {
  const t = useTranslations("insurance.drawers.plan");
  const tTypes = useTranslations("insurance.types");
  const { isDrawerOpen, drawerType, selectedPlan, closeDrawer } =
    useInsuranceUIStore();
  const { createPlan, updatePlan, isLoading } = useInsuranceMutations();

  const isCreate = drawerType === "CREATE_PLAN";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateInsurancePlanDTO>>({
    resolver: zodResolver(CreateInsurancePlanDTO),
    defaultValues: {
      name: "",
      type: "STANDARD",
      coverageDetails: "",
      salaryPercentage: 0,
      maxDependents: 4,
    },
  });

  useEffect(() => {
    if (selectedPlan && !isCreate) {
      reset({
        name: selectedPlan.name,
        type: selectedPlan.type,
        coverageDetails: selectedPlan.coverageDetails || "",
        salaryPercentage: selectedPlan.salaryPercentage,
        maxDependents: selectedPlan.maxDependents,
      });
    } else {
      reset({
        name: "",
        type: "STANDARD",
        coverageDetails: "",
        salaryPercentage: 0,
        maxDependents: 4,
      });
    }
  }, [selectedPlan, isCreate, reset]);

  const onSubmit = (data: z.infer<typeof CreateInsurancePlanDTO>) => {
    if (isCreate) {
      createPlan.mutate(data);
    } else if (selectedPlan?.id) {
      updatePlan.mutate({ id: selectedPlan.id, data });
    }
  };

  if (
    !isDrawerOpen ||
    (drawerType !== "CREATE_PLAN" && drawerType !== "EDIT_PLAN")
  )
    return null;
  if (
    !isDrawerOpen ||
    (drawerType !== "CREATE_PLAN" && drawerType !== "EDIT_PLAN")
  )
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-black text-secondary">
            {isCreate ? t("titleCreate") : t("titleEdit")}
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 text-content-muted hover:text-status-error rounded-xl bg-gray-50 hover:bg-status-error/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 flex-1 overflow-y-auto space-y-5"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.name")}
            </label>
            <input
              {...register("name")}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs text-status-error font-bold">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.type")}
            </label>
            <select
              {...register("type")}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="BASIC">{tTypes("BASIC")}</option>
              <option value="STANDARD">{tTypes("STANDARD")}</option>
              <option value="PREMIUM">{tTypes("PREMIUM")}</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.salaryPercentage")}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                {...register("salaryPercentage", { valueAsNumber: true })}
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-right"
                dir="ltr"
              />
              <span className="absolute start-4 top-1/2 -translate-y-1/2 text-content-muted font-bold">
                %
              </span>
            </div>
            {errors.salaryPercentage && (
              <p className="text-xs text-status-error font-bold">
                {errors.salaryPercentage.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.maxDependents")}
            </label>
            <input
              type="number"
              {...register("maxDependents", { valueAsNumber: true })}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-right"
              dir="ltr"
            />
            {errors.maxDependents && (
              <p className="text-xs text-status-error font-bold">
                {errors.maxDependents.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.coverageDetails")}
            </label>
            <textarea
              {...register("coverageDetails")}
              rows={4}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
          <button
            type="button"
            onClick={closeDrawer}
            className="px-6 py-3 text-content-dark font-bold hover:bg-gray-100 rounded-xl transition-colors"
          >
            {t("buttons.cancel")}
          </button>
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="px-6 py-3 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary-hover disabled:opacity-50 flex items-center gap-2 shadow-md"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isCreate ? t("buttons.create") : t("buttons.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
