"use client";

import { useTranslations } from "next-intl";
import {
  useMyInsurance,
  useInsuranceMutations,
} from "@/app/(hr-system)/insurance/hooks/useInsurance";
import { useInsuranceUIStore } from "@/app/(hr-system)/insurance/hooks/useInsuranceUIStore";
import {
  Loader2,
  UserPlus,
  ShieldCheck,
  Calendar,
  Wallet,
  Users,
  Trash2} from "lucide-react";
import InsurancePlanTypeBadge from "../../_components/InsurancePlanTypeBadge";
import InsuranceModalsContainer from "../../_components/modals/InsuranceModalsContainer";

export default function MyInsurancePage() {
  const t = useTranslations("insurance.employee");
  const { openModal } = useInsuranceUIStore();
  const { data: enrollment, isLoading } = useMyInsurance();

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  if (!enrollment) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center">
        <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-xl font-bold text-secondary">
          {t("noEnrollment.title")}
        </h2>
        <p className="text-content-muted max-w-sm">
          {t("noEnrollment.message")}
        </p>
      </div>
    );
  }

  const maxReached =
    (enrollment.dependents?.length || 0) >=
    (enrollment.plan?.maxDependents || 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-10 text-right">
      <h1 className="text-3xl font-black text-secondary">{t("title")}</h1>

      {/* Enrollment Summary Card */}
      <div className="bg-card rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-secondary p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black">{enrollment.plan?.name}</h2>
              <InsurancePlanTypeBadge type={enrollment.plan?.type as any} />
            </div>
            <p className="text-secondary-light font-medium opacity-80">
              {enrollment.plan?.coverageDetails}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10 min-w-[200px] text-center">
            <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
              {t("monthlyCost")}
            </p>
            <p className="text-4xl font-black flex items-center justify-center gap-1">
              {enrollment.monthlyCost}{" "}
              <span className="text-sm opacity-70 font-bold">
                {t("currency")}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-x-reverse divide-gray-50 border-b border-gray-50">
          <div className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-xs text-content-muted font-bold">
                {t("startDate")}
              </p>
              <p className="font-bold text-content-dark">
                {new Date(enrollment.startDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-xs text-content-muted font-bold">
                {t("salaryPercentage")}
              </p>
              <p className="font-bold text-content-dark">
                {enrollment.plan?.salaryPercentage}%
              </p>
            </div>
          </div>
          <div className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-content-muted font-bold">
                {t("maxDependents")}
              </p>
              <p className="font-bold text-content-dark">
                {enrollment.plan?.maxDependents}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dependents Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-black text-secondary">
              {t("dependents.title")}
            </h3>
            <span className="px-3 py-1 bg-gray-100 text-content-muted rounded-full text-xs font-bold">
              {enrollment.dependents?.length || 0} /{" "}
              {enrollment.plan?.maxDependents}
            </span>
          </div>
          <div className="relative group">
            <button
              disabled={maxReached}
              onClick={() => openModal("ADD_DEPENDENT")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90 disabled:opacity-50 transition-all"
            >
              <UserPlus size={18} />
              {t("dependents.addBtn")}
            </button>
            {maxReached && (
              <div className="absolute bottom-full start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-secondary text-white text-[10px] rounded-lg text-center font-bold shadow-xl z-10">
                {t("dependents.limitReached")}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollment.dependents?.map((dep) => (
            <div
              key={dep.id}
              className="bg-card p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 text-secondary rounded-2xl flex items-center justify-center font-black text-lg">
                  {dep.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-content-dark">{dep.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-secondary/5 text-secondary px-2 py-0.5 rounded-md font-bold">
                      {t(`relations.${dep.relation}`)}
                    </span>
                    <span className="text-[10px] text-content-muted font-medium">
                      {dep.nationalId}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() =>
                  openModal("REMOVE_DEPENDENT", { dependent: dep })
                }
                className="p-2 text-content-muted hover:text-status-error hover:bg-status-error/10 rounded-xl transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {(!enrollment.dependents || enrollment.dependents.length === 0) && (
            <div className="col-span-full py-12 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200 flex flex-col items-center text-center">
              <Users size={32} className="text-gray-300 mb-3" />
              <p className="text-sm font-bold text-content-muted">
                {t("dependents.empty")}
              </p>
            </div>
          )}
        </div>
      </div>

      <InsuranceModalsContainer />
    </div>
  );
}
