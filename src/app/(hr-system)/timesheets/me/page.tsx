"use client";

import { useTranslations } from "next-intl";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useMyTimesheets } from "@/app/(hr-system)/timesheets/hooks/useTimesheets";
import { TimesheetTable } from "@/app/(hr-system)/timesheets/_components/TimesheetTable";
import { TableSkeleton, ErrorState, EmptyState, SpinnerIndicator } from "@/components/ui/data-states";

export default function MyTimesheetsPage() {
  const t = useTranslations("timesheet");
  const { data, isLoading, isError, error, refetch, isFetching } = useMyTimesheets();
  const timesheets = data?.timesheets ?? [];

  const skeletonColumns = [
    { key: "date", label: t("table.date") },
    { key: "checkIn", label: t("table.checkIn") },
    { key: "checkOut", label: t("table.checkOut") },
    { key: "totalHours", label: t("table.totalHours") },
    { key: "overtime", label: t("table.overtime") },
    { key: "status", label: t("table.status") },
  ];

  return (
    <RoleGuard allowedRoles={["EMPLOYEE"]}>
      <div className="p-2 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-secondary">{t("myTimesheets.title")}</h1>
          <SpinnerIndicator show={isFetching && !isLoading} />
        </div>

        {isLoading && <TableSkeleton columns={skeletonColumns} rows={3} />}

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
          <TimesheetTable timesheets={timesheets} isHR={false} />
        )}
      </div>
    </RoleGuard>
  );
}
