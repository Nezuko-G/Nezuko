"use client";

import { useTranslations } from "next-intl";
import { useInsuranceUIStore } from "@/app/[locale]/(hr-system)/insurance/hooks/useInsuranceUIStore";
import {
  useInsuranceMutations,
  useMyInsurance,
} from "@/app/[locale]/(hr-system)/insurance/hooks/useInsurance";
import { X, Loader2, AlertTriangle, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateDependentDTO } from "@/types/dto/insurance.dto";
import { z } from "zod";

export default function InsuranceModalsContainer() {
  const t = useTranslations("insurance.modals");
  const tFields = useTranslations("insurance.employee.dependents.fields");
  const tRelations = useTranslations("insurance.relations");

  const {
    isModalOpen,
    modalType,
    selectedPlan,
    selectedDependent,
    closeModal,
  } = useInsuranceUIStore();
  const { deletePlan, addDependent, removeDependent, isLoading } =
    useInsuranceMutations();
  const { data: enrollment } = useMyInsurance();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateDependentDTO>>({
    resolver: zodResolver(CreateDependentDTO),
  });

  if (!isModalOpen || !modalType) return null;

  const onAddSubmit = (data: z.infer<typeof CreateDependentDTO>) => {
    if (enrollment?.id) {
      addDependent.mutate(
        { enrollmentId: enrollment.id, data },
        {
          onSuccess: () => {
            reset();
            closeModal();
          },
        },
      );
    }
  };

  const renderDeactivatePlan = () => (
    <div className="bg-card w-full max-w-md rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-status-warning/10 text-status-warning rounded-full flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-black text-secondary">
          {t("deactivate.title")}
        </h2>
        <p className="text-content-muted font-medium text-sm">
          {t("deactivate.message", { name: selectedPlan?.name ?? "" })}
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 w-full text-xs font-bold text-content-dark">
          {t("deactivate.warning")}
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
        <button
          onClick={closeModal}
          className="px-5 py-2.5 text-content-dark font-bold hover:bg-gray-100 rounded-xl"
        >
          {t("buttons.cancel")}
        </button>
        <button
          onClick={() => selectedPlan && deletePlan.mutate(selectedPlan.id)}
          disabled={isLoading}
          className="px-5 py-2.5 bg-status-error text-white rounded-xl text-sm font-bold hover:bg-status-error/90 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {t("buttons.confirmDeactivate")}
        </button>
      </div>
    </div>
  );

  const renderAddDependent = () => (
    <div className="bg-card w-full max-w-md rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h2 className="text-lg font-black text-secondary">
          {t("addDependent.title")}
        </h2>
        <button
          onClick={closeModal}
          className="p-1.5 text-content-muted hover:text-status-error rounded-lg"
        >
          <X size={18} />
        </button>
      </div>
      <form onSubmit={handleSubmit(onAddSubmit)} className="p-5 space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-content-dark">
            {tFields("name")}
          </label>
          <input
            {...register("name")}
            className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          {errors.name && (
            <p className="text-xs text-status-error font-bold">
              {errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-content-dark">
            {tFields("relation")}
          </label>
          <select
            {...register("relation")}
            className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          >
            <option value="SPOUSE">{tRelations("SPOUSE")}</option>
            <option value="CHILD">{tRelations("CHILD")}</option>
            <option value="PARENT">{tRelations("PARENT")}</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-content-dark">
            {tFields("dateOfBirth")}
          </label>
          <input
            type="date"
            {...register("dateOfBirth")}
            className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none text-right"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-content-dark">
            {tFields("nationalId")}
          </label>
          <input
            {...register("nationalId")}
            className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
          />
          {errors.nationalId && (
            <p className="text-xs text-status-error font-bold">
              {errors.nationalId.message}
            </p>
          )}
        </div>
      </form>
      <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
        <button
          type="button"
          onClick={closeModal}
          className="px-5 py-2.5 text-content-dark font-bold hover:bg-gray-100 rounded-xl"
        >
          {t("buttons.cancel")}
        </button>
        <button
          type="submit"
          onClick={handleSubmit(onAddSubmit)}
          disabled={isLoading}
          className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {t("buttons.confirmAdd")}
        </button>
      </div>
    </div>
  );

  const renderRemoveDependent = () => (
    <div className="bg-card w-full max-w-md rounded-3xl shadow-xl border border-gray-100 flex flex-col overflow-hidden">
      <div className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-status-error/10 text-status-error rounded-full flex items-center justify-center">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-black text-secondary">
          {t("removeDependent.title")}
        </h2>
        <p className="text-content-muted font-medium text-sm">
          {t("removeDependent.message", { name: selectedDependent?.name ?? "" })}
        </p>
      </div>
      <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
        <button
          onClick={closeModal}
          className="px-5 py-2.5 text-content-dark font-bold hover:bg-gray-100 rounded-xl"
        >
          {t("buttons.cancel")}
        </button>
        <button
          onClick={() =>
            enrollment &&
            selectedDependent &&
            removeDependent.mutate({
              enrollmentId: enrollment.id,
              depId: selectedDependent.id,
            })
          }
          disabled={isLoading}
          className="px-5 py-2.5 bg-status-error text-white rounded-xl text-sm font-bold hover:bg-status-error/90 disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && <Loader2 size={16} className="animate-spin" />}
          {t("buttons.confirmRemove")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light/60 backdrop-blur-sm p-4">
      {modalType === "DEACTIVATE_PLAN" && renderDeactivatePlan()}
      {modalType === "ADD_DEPENDENT" && renderAddDependent()}
      {modalType === "REMOVE_DEPENDENT" && renderRemoveDependent()}
    </div>
  );
}
