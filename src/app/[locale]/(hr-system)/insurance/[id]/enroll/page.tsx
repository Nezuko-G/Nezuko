"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useInsuranceMutations,
  useCostPreview,
} from "@/app/[locale]/(hr-system)/insurance/hooks/useInsurance";
import { useEmployees } from "@/hooks/use-employee";
import { EnrollEmployeeDTO } from "@/types/dto/insurance.dto";
import { EmployeeSummary } from "@/app/[locale]/(hr-system)/employees/types/employees.dto";
import { Loader2, ChevronRight, Calculator } from "lucide-react";

export default function EnrollEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations("insurance.enroll");
  const { enrollEmployee, isLoading: isEnrolling } = useInsuranceMutations();
  const { data: employeesData, isLoading: employeesLoading } = useEmployees();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof EnrollEmployeeDTO>>({
    resolver: zodResolver(EnrollEmployeeDTO),
  });

  const selectedUserId = watch("userId");

  const { data: costPreview, isLoading: isLoadingCost } = useCostPreview(
    id as string,
    selectedUserId,
  );

  const onSubmit = (data: z.infer<typeof EnrollEmployeeDTO>) => {
    enrollEmployee.mutate(
      { planId: id as string, data },
      { onSuccess: () => router.push("/insurance") },
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-right p-4 md:p-8">
      <div
        className="flex items-center gap-2 text-content-muted text-sm font-bold mb-4 cursor-pointer"
        onClick={() => router.push("/insurance")}
      >
        <span>{t("breadcrumbs.plans")}</span>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-primary">{t("breadcrumbs.enroll")}</span>
      </div>

      <h1 className="text-3xl font-black text-secondary">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-2 bg-card p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.employee")}
            </label>
            <select
              {...register("userId")}
              disabled={employeesLoading}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">
                {employeesLoading
                  ? t("states.loadingEmployees")
                  : t("fields.selectEmployee")}
              </option>
              {employeesData?.map((emp: EmployeeSummary) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="text-xs text-status-error font-bold">
                {errors.userId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.startDate")}
              </label>
              <input
                type="date"
                {...register("startDate")}
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-right"
              />
              {errors.startDate && (
                <p className="text-xs text-status-error font-bold">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.endDate")}
              </label>
              <input
                type="date"
                {...register("endDate")}
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none text-right"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 flex justify-end">
            <button
              type="submit"
              disabled={isEnrolling || !selectedUserId}
              className="px-8 py-3 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary-hover disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {isEnrolling && <Loader2 size={16} className="animate-spin" />}
              {t("buttons.confirm")}
            </button>
          </div>
        </form>

        <div className="bg-primary-light/30 p-6 rounded-3xl border border-primary/20 shadow-sm flex flex-col items-center text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -z-10" />
          <div className="w-14 h-14 bg-primary/20 text-primary rounded-2xl flex items-center justify-center">
            <Calculator size={28} />
          </div>
          <h3 className="font-black text-secondary text-lg">
            {t("preview.title")}
          </h3>

          {!selectedUserId ? (
            <p className="text-sm text-content-muted font-medium">
              {t("preview.selectPrompt")}
            </p>
          ) : isLoadingCost ? (
            <div className="py-4">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : costPreview ? (
            <div className="w-full space-y-4 pt-2">
              <div className="flex justify-between items-center bg-background rounded-xl p-3 text-sm">
                <span className="text-content-muted font-bold">
                  {t("preview.salary")}
                </span>
                <span className="font-black text-content-dark">
                  {costPreview.salary} {t("currency")}
                </span>
              </div>
              <div className="flex justify-between items-center bg-background rounded-xl p-3 text-sm">
                <span className="text-content-muted font-bold">
                  {t("preview.percentage")}
                </span>
                <span className="font-black text-primary">
                  {costPreview.salaryPercentage}%
                </span>
              </div>
              <div className="pt-2">
                <p className="text-xs text-content-muted font-bold mb-1">
                  {t("preview.monthlyDeduction")}
                </p>
                <p className="text-4xl font-black text-secondary flex items-center justify-center gap-1">
                  {costPreview.monthlyCost}{" "}
                  <span className="text-base text-content-muted mt-2">
                    {t("currency")}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-status-error font-bold">
              {t("preview.error")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
