"use client";

import { useTranslations } from "next-intl";
import { InsurancePlan } from "@/types/dto/insurance.dto";
import { useInsuranceUIStore } from "@/app/(hr-system)/insurance/hooks/useInsuranceUIStore";
import { Pencil, ShieldOff, Users } from "lucide-react";
import InsurancePlanTypeBadge from "./InsurancePlanTypeBadge";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface InsurancePlanTableProps {
  plans: InsurancePlan[];
}

export default function InsurancePlanTable({ plans }: InsurancePlanTableProps) {
  const t = useTranslations("insurance.plans.table");
  const tStatus = useTranslations("insurance.plans.status");
  const { openDrawer, openModal } = useInsuranceUIStore();
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
            <th className="px-5 py-4 text-right">{t("name")}</th>
            <th className="px-5 py-4 text-center">{t("type")}</th>
            <th className="px-5 py-4 text-center">{t("salaryPercentage")}</th>
            <th className="px-5 py-4 text-center">{t("maxDependents")}</th>
            <th className="px-5 py-4 text-center">{t("status")}</th>
            <th className="px-5 py-4 text-left pl-8">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {plans.map((plan) => (
            <tr
              key={plan.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
            >
              <td className="px-5 py-4">
                <p className="font-semibold text-secondary">{plan.name}</p>
              </td>
              <td className="px-5 py-4 text-center">
                <InsurancePlanTypeBadge type={plan.type} />
              </td>
              <td className="px-5 py-4 text-center font-semibold text-content-dark">
                {plan.salaryPercentage}%
              </td>
              <td className="px-5 py-4 text-center">
                <span className="px-2.5 py-1 bg-gray-50 text-content-dark border border-gray-100 rounded-md font-semibold text-xs inline-flex items-center gap-1">
                  <Users size={14} className="text-content-muted" />
                  {plan.maxDependents}
                </span>
              </td>
              <td className="px-5 py-4 text-center">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-bold",
                    plan.isActive
                      ? "bg-status-success/10 text-status-success"
                      : "bg-gray-100 text-content-muted",
                  )}
                >
                  {plan.isActive ? tStatus("active") : tStatus("inactive")}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2 ps-3">
                  <button
                    onClick={() => router.push(`/insurance/${plan.id}/enroll`)}
                    className="px-2.5 py-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-md transition-all"
                  >
                    {t("enroll")}
                  </button>
                  <button
                    onClick={() => openDrawer("EDIT_PLAN", plan)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted hover:text-secondary transition-colors"
                    title={t("edit") || "Edit"}
                  >
                    <Pencil size={15} />
                  </button>
                  {plan.isActive && (
                    <button
                      onClick={() => openModal("DEACTIVATE_PLAN", { plan })}
                      className="p-1.5 rounded-lg hover:bg-status-error/10 text-content-muted hover:text-status-error transition-colors"
                      title={t("deactivate") || "Deactivate"}
                    >
                      <ShieldOff size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
