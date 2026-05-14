"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import DepartmentTable from "./_components/DepartmentTable";
import { Button } from "@/components/ui/button";
import { useDepartments } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartments";
import DepartmentModalsContainer from "./_components/modals/DepartmentModalsContainer";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useDepartmentUIStore } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartmentUIStore";

export default function DepartmentsPage() {
  const t = useTranslations("departments.list");
  const { openModal } = useDepartmentUIStore();
  const [search, setSearch] = useState("");
  const [parentId, setParentId] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useDepartments({
    page,
    limit,
    search: debouncedSearch,
    parentId,
  });

  const { data: allDepts } = useDepartments({ limit: 100 });

  const departmentsList = data?.data || [];
  const meta = data?.meta;
  const lastPage = meta?.totalPages || 1;
  const filterOptions = (allDepts?.data || []).filter(
  (dept) => !dept.parentId || dept.subDepartmentsCount > 0
  );

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
              className="gap-2 shadow-md font-bold"
              onClick={() => openModal("CREATE")}
            >
              <Plus size={18} />
              <span>{t("registerBtn")}</span>
            </Button>
          </RoleGuard>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card p-2 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 w-full md:w-auto px-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50">
            <Filter size={16} className="text-gray-500" />
          </div>
          <select
            value={parentId}
            onChange={(e) => {
              setParentId(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-48 bg-transparent text-content-dark text-sm font-bold focus:outline-none cursor-pointer appearance-none"
          >
            <option value="">{t("filterAll")}</option>
            {filterOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-8 w-px bg-gray-100 hidden md:block"></div>

        <div className="relative w-full md:max-w-md flex-1">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-content placeholder:text-gray-400 rounded-xl px-11 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 text-right"
          />
          <Search
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
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
              <DepartmentTable departments={departmentsList} />
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
      <DepartmentModalsContainer />
    </div>
  );
}
