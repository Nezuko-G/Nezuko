"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { BarChart3, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "use-debounce";
import { Link } from "@/i18n/navigation";
import { useTimesheets, canManageTimesheets, canSubmitTimesheets } from "@/app/(hr-system)/timesheets/hooks/useTimesheets";
import { useAuthStore } from "@/hooks/useAuthStore";
import { TimesheetFilters } from "@/app/(hr-system)/timesheets/_components/TimesheetFilters";
import { TimesheetTable } from "@/app/(hr-system)/timesheets/_components/TimesheetTable";
import { SubmitTimesheetForm } from "@/app/(hr-system)/timesheets/_components/SubmitTimesheetForm";
import { deriveEmployees } from "@/app/(hr-system)/timesheets/store/employee-map.store";
import { TableSkeleton, ErrorState, EmptyState, SpinnerIndicator } from "@/components/ui/data-states";
import type { TimesheetStatus } from "@/app/(hr-system)/timesheets/types/timesheet.dto";

const PAGE_LIMIT = 10;

export default function TimesheetsPage() {
  const t = useTranslations("timesheet");
  const { role } = useAuthStore();
  const manage = canManageTimesheets(role);
  const canSubmit = canSubmitTimesheets(role);
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const [debouncedSearch] = useDebounce(searchQuery, 500);

  const filters = useMemo(() => ({
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    ...(fromDate && { startDate: fromDate }),
    ...(toDate && { endDate: toDate }),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(manage && { page, limit: PAGE_LIMIT }),
  }), [statusFilter, fromDate, toDate, debouncedSearch, page, manage]);

  const { data, isLoading, isError, error, refetch, isFetching } = useTimesheets(filters);
  const timesheets = data?.timesheets ?? [];
  const meta = data?.meta ?? null;
  const lastPage = meta?.totalPages || 1;
  const employees = useMemo(() => deriveEmployees(timesheets), [timesheets]);

  const handleStatusChange = useCallback((status: TimesheetStatus | "ALL") => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const handleFromDateChange = useCallback((date: string) => {
    setFromDate(date);
    setPage(1);
  }, []);

  const handleToDateChange = useCallback((date: string) => {
    setToDate(date);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  function formatDate(date: Date) {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatTime(date: Date | null) {
    if (!date) return "";
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }

  function exportCsv() {
    if (!timesheets.length) return;

    const headers = [
      t("table.employee"),
      t("table.employeeCode"),
      t("table.date"),
      t("table.checkIn"),
      t("table.checkOut"),
      t("table.totalHours"),
      t("table.overtime"),
      t("table.status"),
    ];
    const rows = timesheets.map((ts) => [
      ts.user ? `${ts.user.firstName} ${ts.user.lastName}` : "",
      ts.user?.employeeCode ?? "",
      formatDate(ts.date),
      formatTime(ts.checkIn),
      formatTime(ts.checkOut),
      ts.totalHours.toFixed(2),
      ts.overtimeHours.toFixed(2),
      t(`status.${ts.status}`),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timesheets-${fromDate || "all"}-to-${toDate || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const skeletonColumns = [
    { key: "employee", label: t("table.employee") },
    { key: "employeeCode", label: t("table.employeeCode") },
    { key: "date", label: t("table.date") },
    { key: "checkIn", label: t("table.checkIn") },
    { key: "checkOut", label: t("table.checkOut") },
    { key: "totalHours", label: t("table.totalHours") },
    { key: "overtime", label: t("table.overtime") },
    { key: "status", label: t("table.status") },
    { key: "actions", label: t("table.actions") },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-secondary">
            {manage ? t("title") : t("myTimesheets.title")}
          </h1>
          <SpinnerIndicator show={isFetching && !isLoading} />
        </div>
        <div className="flex items-center gap-3">
          {manage && (
            <Link
              href="/timesheets/report/overtime"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-secondary text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors border border-gray-200 shadow-sm cursor-pointer"
            >
              <BarChart3 size={16} />
              {t("overtime.title")}
            </Link>
          )}
          {canSubmit && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20 cursor-pointer"
            >
              {t("submit.title")}
            </button>
          )}
          <button
            onClick={exportCsv}
            disabled={isFetching || timesheets.length === 0}
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={16} />
            {t("exportCsv")}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <TimesheetFilters
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      </div>

      {isLoading && <TableSkeleton columns={skeletonColumns} rows={5} />}

      {isError && !isLoading && (
        <ErrorState
          message={error instanceof Error ? error.message : t("loadError")}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && timesheets.length === 0 && (
        <EmptyState message={t("empty")} />
      )}

      {!isLoading && !isError && timesheets.length > 0 && (
        <div>
          <TimesheetTable timesheets={timesheets} isHR={manage} />
          <div className="flex items-center justify-center gap-4 mt-6">
            <p className="text-sm text-content-muted font-bold">
              {t("overtime.pagination", { current: page, total: lastPage })}
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

      {showForm && <SubmitTimesheetForm employees={employees} onClose={() => setShowForm(false)} />}
    </div>
  );
}
