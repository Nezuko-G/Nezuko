"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  Loader2,
  Filter,
  FileBarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInsurancePlans } from "@/app/[locale]/(hr-system)/insurance/hooks/useInsurance";
import { useInsuranceUIStore } from "@/app/[locale]/(hr-system)/insurance/hooks/useInsuranceUIStore";
import InsurancePlanTable from "./_components/InsurancePlanTable";
import PlanDrawer from "./_components/drawers/PlanDrawer";
import InsuranceModalsContainer from "./_components/modals/InsuranceModalsContainer";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useRouter } from "@/i18n/navigation";

export default function InsurancePlansPage() {
  const t = useTranslations("insurance.plans");
  const tinc = useTranslations("insurance");

  const { openDrawer } = useInsuranceUIStore();
  const router = useRouter();

  const [type, setType] = useState("");
  const [isActive, setIsActive] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useInsurancePlans({
    page,
    limit,
    type: type || undefined,
    isActive:
      isActive === "true" ? true : isActive === "false" ? false : undefined,
  });

  const plansList = data?.data || [];
  const meta = data?.meta;
  const lastPage = meta?.totalPages || 1;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-8 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl flex font-black text-secondary tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm flex font-medium text-content-muted">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleGuard allowedRoles={["HR", "TENANT_OWNER"]}>
            <Button
              variant="outline"
              className="gap-2 bg-background border-gray-200 text-content-dark hover:border-primary hover:text-primary shadow-sm"
              onClick={() => router.push("/insurance/coverage-report")}
            >
              <FileBarChart size={18} />
              <span className="hidden sm:inline font-bold">
                {t("coverageReportBtn")}
              </span>
            </Button>
            <Button
              className="gap-2 shadow-md font-bold"
              onClick={() => openDrawer("CREATE_PLAN")}
            >
              <Plus size={18} />
              <span>{t("createBtn")}</span>
            </Button>
          </RoleGuard>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-3 rounded-2xl shadow-sm border border-gray-100 w-full md:w-fit">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 shrink-0">
          <Filter size={18} className="text-gray-500" />
        </div>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-48 bg-transparent text-content-dark text-sm font-bold focus:outline-none cursor-pointer appearance-none px-2"
        >
          <option value="">{t("filters.allTypes")}</option>
          <option value="BASIC">{tinc("types.BASIC")}</option>
          <option value="STANDARD">{tinc("types.STANDARD")}</option>
          <option value="PREMIUM">{tinc("types.PREMIUM")}</option>
        </select>

        <div className="h-8 w-px bg-gray-100 hidden md:block"></div>

        <select
          value={isActive}
          onChange={(e) => {
            setIsActive(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-48 bg-transparent text-content-dark text-sm font-bold focus:outline-none cursor-pointer appearance-none px-2"
        >
          <option value="">{t("filters.allStatuses")}</option>
          <option value="true">{t("status.active")}</option>
          <option value="false">{t("status.inactive")}</option>
        </select>
      </div>

      <div className="bg-card rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-status-error font-bold">
            {t("errors.fetch")}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-x-auto">
              <InsurancePlanTable plans={plansList} />
            </div>

            {lastPage > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
                <p className="text-sm text-content-muted font-bold">
                  {t("pagination", { current: page, total: lastPage })}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-9 w-9 p-0 rounded-xl hover:bg-gray-100"
                  >
                    <ChevronRight size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-9 w-9 p-0 rounded-xl hover:bg-gray-100"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <PlanDrawer />
      <InsuranceModalsContainer />
    </div>
  );
}
