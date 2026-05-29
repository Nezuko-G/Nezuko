"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Loader2 } from "lucide-react";
import { useDebounce } from "use-debounce";
import DepartmentTable from "./_components/DepartmentTable";
import { useDepartments } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartments";
import DepartmentModalsContainer from "./_components/modals/DepartmentModalsContainer";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useDepartmentUIStore } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartmentUIStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    (dept) => !dept.parentId || dept.subDepartmentsCount > 0,
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 md:p-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-secondary">{t("title")}</h1>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <RoleGuard allowedRoles={["HR_ADMIN", "TENANT_OWNER"]}>
            <button
              onClick={() => openModal("CREATE")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-seconadry font-bold text-sm shadow hover:opacity-90 transition"
            >
              <Plus size={16} />
              <span>{t("registerBtn")}</span>
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
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-semibold placeholder:text-content-muted placeholder:font-normal"
        />

        <select
          value={parentId}
          onChange={(e) => {
            setParentId(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm font-semibold focus:outline-none cursor-pointer"
        >
          <option value="">{t("filterAll")}</option>
          {filterOptions.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[400px]">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-status-error font-bold min-h-[200px]">
            {t("errors.fetch")}
          </div>
        ) : (
          <>
            <div className="flex-1">
              <DepartmentTable departments={departmentsList} />
            </div>

            {lastPage > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-center gap-4 bg-gray-50/50">
                <p className="text-sm text-content-muted font-bold">
                  {t("pagination", { current: page, total: lastPage })}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
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
