"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useTranslations } from "next-intl";
import { AlertCircle, RefreshCw, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLeaveRequests } from "@/app/(hr-system)/leave/hooks/useLeaveRequests";
import { useAuthStore } from "@/hooks/useAuthStore";
import { LeaveRequestForm } from "./_components/LeaveRequestForm";
import { LeaveRequestsTable } from "./_components/LeaveRequestsTable";
import { LeaveFilters } from "./_components/LeaveFilters";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-3">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ms-auto" />
      </td>
    </tr>
  );
}

export default function LeavePage() {
  const t = useTranslations("leave");
  const { role } = useAuthStore();
  const isHR = role === "HR_ADMIN" || role === "MANAGER";

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const limit = 10;

  const { data, isLoading, isError, error, refetch, isFetching } = useLeaveRequests({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const requests = data?.data ?? [];
  const meta = data?.meta;
  const lastPage = meta?.totalPages || 1;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-secondary">
            {isHR ? t("allRequests") : t("myRequests")}
          </h1>
          {isFetching && !isLoading && (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          )}
        </div>
        <RoleGuard allowedRoles={["EMPLOYEE"]}>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20"
          >
            {t("createRequest")}
          </button>
        </RoleGuard>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-6">
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
        <LeaveFilters
          statusFilter={statusFilter}
          onStatusChange={(s) => {
            setStatusFilter(s);
            setPage(1);
          }}
        />
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  {t("employee")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  {t("employeeCode")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  {t("startDate")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  {t("endDate")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  {t("reason")}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                  {t("status")}
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </tbody>
          </table>
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-4">
            {error instanceof Error ? error.message : t("loadError")}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            {t("tryAgain")}
          </button>
        </div>
      )}

      {!isLoading && !isError && requests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-base">{t("noRequests")}</p>
        </div>
      )}

      {!isLoading && !isError && requests.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <LeaveRequestsTable requests={requests} isHR={isHR} />

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center gap-4 bg-gray-50/50">
            <p className="text-sm text-content-muted font-bold">
              {t("pagination", { current: page, total: lastPage })}
            </p>
            <div className="flex ltr:flex-row-reverse rtl:flex-row items-center gap-1.5">
              <button
                disabled={page >= lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && <LeaveRequestForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
