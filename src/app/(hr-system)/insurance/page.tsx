"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Loader2, FileBarChart } from "lucide-react";
import { useInsurancePlans } from "@/app/(hr-system)/insurance/hooks/useInsurance";
import { useInsuranceUIStore } from "@/app/(hr-system)/insurance/hooks/useInsuranceUIStore";
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

  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [isActive, setIsActive] = useState<string>("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useInsurancePlans({
    page,
    limit,
    search,
    type: type || undefined,
    isActive:
      isActive === "true" ? true : isActive === "false" ? false : undefined,
  });

  const plansList = data?.data || [];
  const meta = data?.meta;
  const lastPage = meta?.totalPages || 1;

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 md:p-8 text-start">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-secondary">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-content-muted">{t("subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <RoleGuard allowedRoles={["HR_ADMIN", "TENANT_OWNER"]}>
            <button
              onClick={() => router.push("/insurance/coverage-report")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-card text-content hover:text-primary transition font-bold text-sm shadow-sm"
            >
              <FileBarChart size={16} />
              <span>{t("coverageReportBtn")}</span>
            </button>
            <button
              onClick={() => openDrawer("CREATE_PLAN")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-secondary font-bold text-sm shadow hover:opacity-90 transition"
            >
              <Plus size={16} />
              <span>{t("createBtn")}</span>
            </button>
          </RoleGuard>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm font-semibold focus:outline-none cursor-pointer"
        >
          <option value="">{t("filters.allTypes")}</option>
          <option value="BASIC">{tinc("types.BASIC")}</option>
          <option value="STANDARD">{tinc("types.STANDARD")}</option>
          <option value="PREMIUM">{tinc("types.PREMIUM")}</option>
        </select>

        <select
          value={isActive}
          onChange={(e) => {
            setIsActive(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm font-semibold focus:outline-none cursor-pointer"
        >
          <option value="">{t("filters.allStatuses")}</option>
          <option value="true">{t("status.active")}</option>
          <option value="false">{t("status.inactive")}</option>
        </select>
      </div>

      <div className="w-full">
        {isLoading ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm flex items-center justify-center min-h-100">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : isError ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm flex items-center justify-center text-status-error font-bold min-h-50">
            {t("errors.fetch")}
          </div>
        ) : (
          <div className="flex-1">
            <InsurancePlanTable
              plans={plansList}
              page={page}
              lastPage={lastPage}
              setPage={setPage}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      <PlanDrawer />
      <InsuranceModalsContainer />
    </div>
  );
}
