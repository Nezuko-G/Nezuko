"use client";

import { useTranslations } from "next-intl";
import { Department } from "@/types/dto/department.dto";
import { useDepartmentUIStore } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartmentUIStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Edit2, CornerDownRight } from "lucide-react";
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
  const canEdit = role === "HR" || role === "TENANT_OWNER";

  return (
    <div className="w-full overflow-x-auto bg-card rounded-2xl shadow-sm border border-gray-100">
      <table className="w-full text-sm text-right">
        <thead className="bg-background text-content-muted border-b border-gray-100 uppercase text-xs">
          <tr>
            <th className="px-6 py-4 font-bold">{t("name")}</th>
            <th className="px-6 py-4 font-bold">{t("manager")}</th>
            <th className="px-6 py-4 font-bold text-center">
              {t("employees")}
            </th>
            <th className="px-6 py-4 font-bold">{t("parent")}</th>
            <th className="px-6 py-4 font-bold text-center">{t("status")}</th>
            {canEdit && (
              <th className="px-6 py-4 font-bold text-center">
                {t("actions")}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {departments.map((dept) => (
            <tr
              key={dept.id}
              onClick={() => router.push(`/departments/${dept.id}`)}
              className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {dept.parentId && (
                    <CornerDownRight size={16} className="text-gray-300" />
                  )}
                  <span
                    className={`font-bold text-content-dark ${dept.parentId ? "text-sm" : "text-base"}`}
                  >
                    {dept.name}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                {dept.manager ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-bold shrink-0">
                      {dept.manager.firstName.charAt(0)}
                    </div>
                    <span className="font-medium text-content-dark">
                      {dept.manager.firstName} {dept.manager.lastName}
                    </span>
                  </div>
                ) : (
                  <span className="text-content-muted">{t("unassigned")}</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold text-xs">
                  {dept.employeeCount}
                </span>
              </td>
              <td className="px-6 py-4 text-content-muted text-xs font-medium">
                {dept.parent ? dept.parent.name : t("root")}
              </td>
              <td className="px-6 py-4 text-center">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-status-success/10 text-status-success">
                  {tStatus("ACTIVE")}
                </span>
              </td>
              {canEdit && (
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal("EDIT", dept);
                      }}
                      className="p-2 text-content hover:text-secondary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
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
