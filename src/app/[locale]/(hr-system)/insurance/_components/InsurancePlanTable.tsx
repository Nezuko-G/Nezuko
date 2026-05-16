"use client";

import { useTranslations } from "next-intl";
import { InsurancePlan } from "@/types/dto/insurance.dto";
import { useInsuranceUIStore } from "@/app/[locale]/(hr-system)/insurance/hooks/useInsuranceUIStore";
import { Edit2, ShieldOff, Users } from "lucide-react";
import InsurancePlanTypeBadge from "./InsurancePlanTypeBadge";
import { useRouter } from "@/i18n/navigation";

interface InsurancePlanTableProps {
  plans: InsurancePlan[];
}

export default function InsurancePlanTable({ plans }: InsurancePlanTableProps) {
  const t = useTranslations("insurance.plans.table");
  const tStatus = useTranslations("insurance.plans.status");
  const { openDrawer, openModal } = useInsuranceUIStore();
  const router = useRouter();

  return (
    <div className="w-full overflow-x-auto bg-card rounded-2xl shadow-sm border border-gray-100">
      <table className="w-full text-sm text-right">
        <thead className="bg-background text-content-muted border-b border-gray-100 uppercase text-xs">
          <tr>
            <th className="px-6 py-4 font-bold">{t("name")}</th>
            <th className="px-6 py-4 font-bold text-center">{t("type")}</th>
            <th className="px-6 py-4 font-bold text-center">
              {t("salaryPercentage")}
            </th>
            <th className="px-6 py-4 font-bold text-center">
              {t("maxDependents")}
            </th>
            <th className="px-6 py-4 font-bold text-center">{t("status")}</th>
            <th className="px-6 py-4 font-bold text-center">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {plans.map((plan) => (
            <tr
              key={plan.id}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <p className="font-bold text-content-dark">{plan.name}</p>
              </td>
              <td className="px-6 py-4 text-center">
                <InsurancePlanTypeBadge type={plan.type} />
              </td>
              <td className="px-6 py-4 text-center font-bold text-content-dark">
                {plan.salaryPercentage}%
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-3 py-1 bg-gray-50 text-content rounded-full font-bold text-xs inline-flex items-center gap-1">
                  <Users size={14} />
                  {plan.maxDependents}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${plan.isActive ? "bg-status-success/10 text-status-success" : "bg-gray-100 text-gray-500"}`}
                >
                  {plan.isActive ? tStatus("active") : tStatus("inactive")}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() =>
                      router.push(`/plans/${plan.id}/enroll`)
                    }
                    className="px-3 py-1.5 text-xs font-bold text-primary bg-primary-light hover:bg-primary/20 rounded-lg transition-colors"
                  >
                    {t("enroll")}
                  </button>
                  <button
                    onClick={() => openDrawer("EDIT_PLAN", plan)}
                    className="p-1.5 text-content hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  {plan.isActive && (
                    <button
                      onClick={() => openModal("DEACTIVATE_PLAN", { plan })}
                      className="p-1.5 text-content hover:text-status-error hover:bg-status-error/10 rounded-lg transition-colors"
                    >
                      <ShieldOff size={16} />
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
