"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTimesheets, canManageTimesheets, canSubmitTimesheets } from "@/app/[locale]/(hr-system)/timesheets/hooks/useTimesheets";
import { useAuthStore } from "@/hooks/useAuthStore";
import { TimesheetFilters } from "@/app/[locale]/(hr-system)/timesheets/_components/TimesheetFilters";
import { TimesheetTable } from "@/app/[locale]/(hr-system)/timesheets/_components/TimesheetTable";
import { SubmitTimesheetForm } from "@/app/[locale]/(hr-system)/timesheets/_components/SubmitTimesheetForm";
import { deriveEmployees } from "@/app/[locale]/(hr-system)/timesheets/store/employee-map.store";
import { TableSkeleton, ErrorState, EmptyState, SpinnerIndicator } from "@/components/ui/data-states";
import type { TimesheetStatus } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";

export default function TimesheetsPage() {
  const t = useTranslations("timesheet");
  const { role } = useAuthStore();
  const manage = canManageTimesheets(role);
  const canSubmit = canSubmitTimesheets(role);
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [userId, setUserId] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filters = {
    ...(statusFilter !== "ALL" && { status: statusFilter }),
    ...(fromDate && { startDate: fromDate }),
    ...(toDate && { endDate: toDate }),
    ...(userId && { userId }),
  };

  const { data: timesheets = [], isLoading, isError, error, refetch, isFetching } = useTimesheets(filters);
  const employees = useMemo(() => deriveEmployees(timesheets), [timesheets]);

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
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-secondary text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors border border-gray-200 shadow-sm"
            >
              <BarChart3 size={16} />
              {t("overtime.title")}
            </Link>
          )}
          {canSubmit && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              {t("submit.title")}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <TimesheetFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          userId={userId}
          onUserIdChange={setUserId}
          employees={employees}
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
        <TimesheetTable timesheets={timesheets} isHR={manage} />
      )}

      {showForm && <SubmitTimesheetForm employees={employees} onClose={() => setShowForm(false)} />}
    </div>
  );
}
