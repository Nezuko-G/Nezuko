"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Eye, Pencil, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmployeeStore } from "../stores/employee.store";
import { MOCK_DEPARTMENTS } from "../utils/mock-data";
import type { Employee } from "../types";

interface Props {
  onAddClick: () => void;
  onTerminate: (employee: Employee) => void;
}

export default function EmployeeTable({ onAddClick, onTerminate }: Props) {
  const t = useTranslations("employees");
  const router = useRouter();
  const { employees, filters, isLoading, fetchEmployees, setFilters } = useEmployeeStore();

  useEffect(() => { fetchEmployees(); }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-secondary">{t("title")}</h1>
        <button
          onClick={onAddClick}
          className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-sm shadow hover:opacity-90 transition"
        >
          + {t("addEmployee")}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          value={filters.departmentId}
          onChange={(e) => setFilters({ departmentId: e.target.value })}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm focus:outline-none"
        >
          <option value="">{t("allDepartments")}</option>
          {MOCK_DEPARTMENTS.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select
          value={filters.status}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e) => setFilters({ status: e.target.value as any })}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm focus:outline-none"
        >
          <option value="">{t("allStatuses")}</option>
          <option value="ACTIVE">{t("status.active")}</option>
          <option value="TERMINATED">{t("status.terminated")}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
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
                <td colSpan={6} className="py-16 text-center text-content-muted">{t("loading")}</td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-content-muted">{t("noResults")}</td>
              </tr>
            ) : (
              employees.map((emp) => {
                const isTerminated = emp.status === "TERMINATED";
                const initials = `${emp.firstName[0]}${emp.lastName[0]}`;
                return (
                  <tr
                    key={emp.id}
                    className={cn(
                      "border-b border-gray-50 last:border-0 transition-colors",
                      isTerminated ? "opacity-50" : "hover:bg-gray-50/60"
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary">{emp.firstName} {emp.lastName}</p>
                          <p className="text-content-muted text-xs">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-content-muted">{emp.employeeCode}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                        {emp.department.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-content-muted">{emp.hireDate}</td>
                    <td className="px-5 py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-xs font-bold",
                        isTerminated
                          ? "bg-status-error/10 text-status-error"
                          : "bg-status-success/10 text-status-success"
                      )}>
                        {t(`status.${emp.status.toLowerCase()}`)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/employees/${emp.id}`)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted hover:text-secondary transition"
                          title={t("actions.view")}
                        >
                          <Eye size={15} />
                        </button>
                        {!isTerminated && (
                          <>
                            <button
                              onClick={() => router.push(`/employees/${emp.id}`)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted hover:text-secondary transition"
                              title={t("actions.edit")}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => onTerminate(emp)}
                              className="p-1.5 rounded-lg hover:bg-status-error/10 text-content-muted hover:text-status-error transition"
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
    </div>
  );
}