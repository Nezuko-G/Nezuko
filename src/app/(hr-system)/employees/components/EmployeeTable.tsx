"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Eye, Pencil, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmployees } from "../hooks/useEmployees";
import { useDepartments } from "@/app/(hr-system)/departments/hooks/useDepartments";
import { Pagination } from "@/app/(hr-system)/_components/Pagination";
import type { EmployeeSummary } from "../types/employees.dto";

interface Props {
  onAddClick: () => void;
  onTerminate: (employee: EmployeeSummary) => void;
}

export default function EmployeeTable({ onAddClick, onTerminate }: Props) {
  const t = useTranslations("employees");
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: employeesData, isLoading } = useEmployees({
    page,
    limit,
    search,
    departmentId,
    status,
  });

  const { data: departmentsData } = useDepartments({});

  const employees = employeesData?.data?.employees ?? [];
  const departments = departmentsData?.data ?? [];
  const totalPages = employeesData?.data?.meta?.totalPages ?? 1;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentId(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-secondary">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-content-muted">{t("subtitle")}</p>
        </div>

        <button
          onClick={onAddClick}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-secondary shadow transition hover:opacity-90"
        >
          + {t("addEmployee")}
        </button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={handleSearchChange}
          className="flex-1 rounded-xl border border-gray-200 bg-card px-4 py-2 text-sm text-content focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          value={departmentId}
          onChange={handleDepartmentChange}
          className="rounded-xl border border-gray-200 bg-card px-3 py-2 text-sm text-content focus:outline-none"
        >
          <option value="">{t("allDepartments")}</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={handleStatusChange}
          className="rounded-xl border border-gray-200 bg-card px-3 py-2 text-sm text-content focus:outline-none"
        >
          <option value="">{t("allStatuses")}</option>
          <option value="ACTIVE">{t("status.active")}</option>
          <option value="TERMINATED">{t("status.terminated")}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-content-muted">
              <th className="px-5 py-4 text-left">{t("table.employee")}</th>
              <th className="px-5 py-4 text-left">{t("table.code")}</th>
              <th className="px-5 py-4 text-left">{t("table.department")}</th>
              <th className="px-5 py-4 text-left">{t("table.hireDate")}</th>
              <th className="px-5 py-4 text-left">{t("table.status")}</th>
              <th className="px-5 py-4 text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-content-muted"
                >
                  {t("loading")}
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-content-muted"
                >
                  {t("noResults")}
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const isTerminated = emp.status === "TERMINATED";
                const initials = `${emp.firstName[0]}${emp.lastName[0]}`;
                return (
                  <tr
                    key={emp.id}
                    className={cn(
                      "border-b border-gray-50 transition-colors last:border-0",
                      isTerminated ? "opacity-50" : "hover:bg-gray-50/60",
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-content-muted">
                            {emp.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-content-muted">
                        {emp.employeeCode}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                        {emp.department?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-content-muted">
                      {emp.hireDate
                        ? new Date(emp.hireDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "rounded-md px-2 py-1 text-xs font-bold",
                          isTerminated
                            ? "bg-status-error/10 text-status-error"
                            : "bg-status-success/10 text-status-success",
                        )}
                      >
                        {t(`status.${emp.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/employees/${emp.id}`)}
                          className="rounded-lg p-1.5 text-content-muted transition hover:bg-gray-100 hover:text-secondary"
                          title={t("actions.view")}
                        >
                          <Eye size={15} />
                        </button>
                        {!isTerminated && (
                          <>
                            <button
                              onClick={() =>
                                router.push(`/employees/${emp.id}`)
                              }
                              className="rounded-lg p-1.5 text-content-muted transition hover:bg-gray-100 hover:text-secondary"
                              title={t("actions.edit")}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => onTerminate(emp)}
                              className="rounded-lg p-1.5 text-content-muted transition hover:bg-status-error/10 hover:text-status-error"
                              title={t("actions.terminate")}
                            >
                              <UserX size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && employees.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          label={t("pagination", { current: page, total: totalPages })}
        />
      )}
    </div>
  );
}
