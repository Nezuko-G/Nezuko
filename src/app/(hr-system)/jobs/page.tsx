"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Plus, Loader2, Search, FilterX } from "lucide-react";
import { useJobsList } from "./hooks/useJobs";
import JobTable from "./_components/JobTable";
import JobAuthPopup from "./_components/JobAuthPopup";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useRouter } from "@/i18n/navigation";
import { useDebounce } from "use-debounce";
import { JobFilters } from "./types/job.dto";
import { Pagination } from "../_components/Pagination";

export default function JobsPage() {
  const t = useTranslations("jobs.list");
  const tForm = useTranslations("jobs.form");
  const locale = useLocale();
  const router = useRouter();

  const [isAuthGuarded, setIsAuthGuarded] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const limit = 10;

  const [filters, setFilters] = useState<JobFilters>({
    jobType: "all",
    workMode: "all",
  });

  useEffect(() => {
    const authFlag = localStorage.getItem("jobs_is_authenticated");
    if (authFlag === "true") {
      setIsAuthGuarded(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const { data, isLoading, isError, error, refetch } = useJobsList(
    page,
    limit,
    locale,
    debouncedSearch,
    filters,
  );

  const jobs = data?.data || [];
  const lastPage = data?.pagination?.totalPages || 1;

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      jobType: "all",
      workMode: "all",
    });
    setSearchTerm("");
    setPage(1);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!isAuthGuarded || (isError && (error as any)?.response?.status === 401)) {
    return (
      <JobAuthPopup
        onSuccess={() => {
          setIsAuthGuarded(true);
          refetch();
        }}
        onClose={() => router.back()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-6xl mx-auto p-4 md:pt-8 text-start">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-secondary">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-content-muted">{t("subtitle")}</p>
        </div>

        <RoleGuard allowedRoles={["HR_ADMIN", "TENANT_OWNER"]}>
          <button
            onClick={() => router.push("/jobs/create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-secondary font-bold text-sm shadow hover:opacity-90 transition w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>{t("createBtn")}</span>
          </button>
        </RoleGuard>
      </div>

      <div className="bg-card p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div className="relative md:col-span-2">
            <input
              type="text"
              placeholder={tForm("placeholders.search") || "Search..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 pe-10 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition text-sm font-medium"
            />
            <Search
              size={16}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-content-muted"
            />
          </div>

          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange("jobType", e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-secondary outline-none focus:bg-white transition"
          >
            <option value="all">
              {tForm("fields.jobType")} {t("all")}
            </option>
            <option value="full-time">{tForm("options.fullTime")}</option>
            <option value="part-time">{tForm("options.partTime")}</option>
            <option value="internship">{tForm("options.internship")}</option>
          </select>

          <select
            value={filters.workMode}
            onChange={(e) => handleFilterChange("workMode", e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-bold text-secondary outline-none focus:bg-white transition"
          >
            <option value="all">
              {tForm("fields.workMode")} {t("all")}
            </option>
            <option value="office">{tForm("options.office")}</option>
            <option value="remote">{tForm("options.remote")}</option>
            <option value="hybrid">{tForm("options.hybrid")}</option>
          </select>

          <button
            onClick={resetFilters}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-content-muted hover:bg-gray-50 text-sm font-bold transition"
          >
            <FilterX size={16} />
            <span>{t("reset")}</span>
          </button>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        {isLoading ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm flex items-center justify-center min-h-87.5">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        ) : isError && (error as any)?.response?.status !== 401 ? (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm flex items-center justify-center text-status-error font-bold min-h-50">
            {t("errors.fetch")}
          </div>
        ) : (
          <>
            <div className="flex-1">
              <JobTable jobs={jobs} />
            </div>

            <Pagination
              currentPage={page}
              totalPages={lastPage}
              onPageChange={setPage}
              label={t("pagination", { current: page, total: lastPage })}
              className="mt-auto"
            />
          </>
        )}
      </div>
    </div>
  );
}
