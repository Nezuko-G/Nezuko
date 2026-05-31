"use client";

import { useTranslations } from "next-intl";
import { Department } from "@/types/dto/department.dto";
import { useDepartmentUIStore } from "@/app/(hr-system)/departments/hooks/useDepartmentUIStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Pencil, CornerDownRight } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

interface DepartmentTableProps {
  departments: Department[];
}

export default function DepartmentTable({ departments }: DepartmentTableProps) {
  const t = useTranslations("departments.list.table");
  const tStatus = useTranslations("departments.status");
  const { openModal } = useDepartmentUIStore();
  const { role } = useAuthStore();
  const router = useRouter();
  const canEdit = role === "HR_ADMIN" || role === "TENANT_OWNER";

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm">
      <table className="w-full text-sm text-right">
        <thead>
          <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
            <th className="px-5 py-4 text-right">{t("name")}</th>
            <th className="px-5 py-4 text-right">{t("manager")}</th>
            <th className="px-5 py-4 text-center">{t("employees")}</th>
            <th className="px-5 py-4 text-right">{t("parent")}</th>
            <th className="px-5 py-4 text-center">{t("status")}</th>
            {canEdit && (
              <th className="px-5 py-4 text-left ps-8">{t("actions")}</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {departments.map((dept) => (
            <tr
              key={dept.id}
              onClick={() => router.push(`/departments/${dept.id}`)}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors cursor-pointer group"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  {dept.parentId && (
                    <CornerDownRight
                      size={14}
                      className="text-gray-300 shrink-0 select-none"
                    />
                  )}
                  <span className="font-semibold text-secondary">
                    {dept.name}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                {dept.manager ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {dept.manager.firstName.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-secondary">
                      {dept.manager.firstName} {dept.manager.lastName}
                    </span>
                  </div>
                ) : (
                  <span className="text-content-muted text-xs font-normal">
                    {t("unassigned")}
                  </span>
                )}
              </td>
              <td className="px-5 py-4 text-center">
                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md font-semibold text-xs">
                  {dept.employeeCount}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-content-muted text-xs font-medium">
                  {dept.parent ? dept.parent.name : t("root")}
                </span>
              </td>
              <td className="px-5 py-4 text-center">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-status-success/10 text-status-success">
                  {tStatus("ACTIVE")}
                </span>
              </td>
              {canEdit && (
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2 ps-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("EDIT", dept);
                      }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted hover:text-secondary transition-colors"
                      title={t("edit") || "Edit"}
                    >
                      <Pencil size={15} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
