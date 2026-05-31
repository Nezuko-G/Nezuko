"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Play } from "lucide-react";
import { useEmployees } from "@/hooks/use-employee";
import { useDepartments } from "@/app/(hr-system)/departments/hooks/useDepartments";

interface ReportFilterBarProps {
  supportedFilters: string[];
  initialFilters?: Record<string, string>;
  isLoading: boolean;
  onGenerate: (filters: Record<string, string>) => void;
}

export default function ReportFilterBar({
  supportedFilters,
  initialFilters,
  isLoading,
  onGenerate,
}: ReportFilterBarProps) {
  const t = useTranslations("reports.filters");
  const { data: employeesData, isLoading: employeesLoading } = useEmployees();
  const { data: departmentsData, isLoading: deptsLoading } = useDepartments({
    limit: 100,
  });

  const [filters, setFilters] = useState<Record<string, string>>(
    initialFilters || {},
  );
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setDateError("");
  };

  const handleGenerate = () => {
    if (
      filters.startDate &&
      filters.endDate &&
      new Date(filters.endDate) < new Date(filters.startDate)
    ) {
      setDateError(t("errors.dateRange"));
      return;
    }
    onGenerate(filters);
  };

  const employees = employeesData || [];
  const departments = departmentsData?.data || [];

  return (
    <div className="bg-card p-4 rounded-3xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        {supportedFilters.includes("startDate") && (
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-content-dark">
              {t("startDate")}
            </label>
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        )}

        {supportedFilters.includes("endDate") && (
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-content-dark">
              {t("endDate")}
            </label>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        )}

        {supportedFilters.includes("departmentId") && (
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-content-dark">
              {t("department")}
            </label>
            <select
              value={filters.departmentId || ""}
              onChange={(e) => handleChange("departmentId", e.target.value)}
              disabled={deptsLoading}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">
                {deptsLoading ? t("loading") : t("allDepartments")}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {supportedFilters.includes("userId") && (
          <div className="space-y-1.5 flex-1 min-w-[200px]">
            <label className="text-xs font-bold text-content-dark">
              {t("employee")}
            </label>
            <select
              value={filters.userId || ""}
              onChange={(e) => handleChange("userId", e.target.value)}
              disabled={employeesLoading}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">
                {employeesLoading ? t("loading") : t("allEmployees")}
              </option>
              {employees.map((emp: any) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm shrink-0 h-[42px] min-w-[140px]"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Play size={16} />
          )}
          {t("generateBtn")}
        </button>
      </div>

      {dateError && (
        <p className="text-xs font-bold text-status-error px-1">{dateError}</p>
      )}
    </div>
  );
}
