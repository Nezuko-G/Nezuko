"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AttendanceWidget } from "@/app/(hr-system)/attendance/_components/AttendanceWidget";
import { MyTimesheetsFilters } from "@/app/(hr-system)/attendance/_components/MyTimesheetsFilters";
import { MyTimesheetsTable } from "@/app/(hr-system)/attendance/_components/MyTimesheetsTable";
import { useMyTimesheets } from "@/app/(hr-system)/attendance/hooks/useMyTimesheets";
import { TableSkeleton, ErrorState, EmptyState, SpinnerIndicator } from "@/components/ui/data-states";
import type { TimesheetStatus } from "@/app/(hr-system)/attendance/types/timesheet.dto";

const PAGE_LIMIT = 10;

export default function MyAttendancePage() {
  const t = useTranslations("timesheet");
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(() => ({
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    ...(fromDate && { fromDate }),
    ...(toDate && { toDate }),
    page,
    limit: PAGE_LIMIT,
  }), [statusFilter, fromDate, toDate, page]);

  const { data, isLoading, isError, error, refetch, isFetching } = useMyTimesheets(filters);

  const timesheets = data?.timesheets ?? [];
  const meta = data?.meta ?? null;
  const lastPage = meta?.totalPages || 1;

  function handleStatusChange(status: TimesheetStatus | "ALL") {
    setStatusFilter(status);
    setPage(1);
  }

  function handleFromDateChange(date: string) {
    setFromDate(date);
    setPage(1);
  }

  function handleToDateChange(date: string) {
    setToDate(date);
    setPage(1);
  }

  const skeletonColumns = [
    { key: "date", label: t("table.date") },
    { key: "checkIn", label: t("table.checkIn") },
    { key: "checkOut", label: t("table.checkOut") },
    { key: "totalHours", label: t("table.totalHours") },
    { key: "overtime", label: t("table.overtime") },
    { key: "status", label: t("table.status") },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <AttendanceWidget />
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-secondary">{t("myTimesheets.title")}</h2>
        <SpinnerIndicator show={isFetching && !isLoading} />
      </div>

      <div className="mb-6">
        <MyTimesheetsFilters
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
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
        <EmptyState message={t("myTimesheets.empty")} />
      )}

      {!isLoading && !isError && timesheets.length > 0 && (
        <div>
          <MyTimesheetsTable timesheets={timesheets} />
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
    </div>
  );
}
