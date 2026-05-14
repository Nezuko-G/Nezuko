"use client";

import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  useDepartment,
  useDepartmentMutations,
} from "@/app/[locale]/(hr-system)/departments/hooks/useDepartments";
import { useDepartmentUIStore } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartmentUIStore";
import {
  Loader2,
  Users,
  Network,
  Trash2,
  Edit,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import DepartmentModalsContainer from "../_components/modals/DepartmentModalsContainer";

export default function DepartmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const t = useTranslations("departments.details");
  const { openModal } = useDepartmentUIStore();
  const { data: department, isLoading } = useDepartment(id as string);
  const { deleteDepartment } = useDepartmentMutations();

  if (isLoading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  if (!department)
    return (
      <div className="flex h-96 items-center justify-center text-status-error">
        {t("notFound")}
      </div>
    );

  const handleDelete = () => {
    if (department.employeeCount > 0) {
      // toast.error(t("errors.notEmpty"));
      return;
    }
    deleteDepartment.mutate(department.id, {
      onSuccess: () => router.push("/departments"),
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-right pb-10">
      <div
        className="flex items-center gap-2 text-content-muted text-sm font-bold mb-4 cursor-pointer"
        onClick={() => router.push("/departments")}
      >
        <span>{t("breadcrumbs.list")}</span>
        <ChevronRight size={14} className="rotate-180" />
        <span className="text-primary">{department.name}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-secondary">
          {department.name}
        </h1>
        <RoleGuard allowedRoles={["HR", "TENANT_OWNER"]}>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-status-error border-status-error/20 hover:bg-status-error/10"
              onClick={handleDelete}
            >
              <Trash2 size={16} className="ml-2" />
              {t("actions.delete")}
            </Button>
            <Button onClick={() => openModal("EDIT", department)}>
              <Edit size={16} className="ml-2" />
              {t("actions.edit")}
            </Button>
          </div>
        </RoleGuard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-sm">
              {t("stats.employees")}
            </p>
            <p className="text-3xl font-black text-content-dark">
              {department.employeeCount}
            </p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl">
            <Network size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-sm">
              {t("stats.subDepartments")}
            </p>
            <p className="text-3xl font-black text-content-dark">
              {department.children.length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-content-muted font-bold text-xs">
              {t("info.description")}
            </p>
            <p className="text-content-dark font-medium mt-1">
              {department.description || "---"}
            </p>
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs">
              {t("info.manager")}
            </p>
            {department.manager ? (
              <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
                <div className="w-5 h-5 rounded-full bg-secondary text-primary flex items-center justify-center text-[10px] font-bold">
                  {department.manager.firstName.charAt(0)}
                </div>
                <span className="text-sm font-bold text-content-dark">
                  {department.manager.firstName} {department.manager.lastName}
                </span>
              </div>
            ) : (
              <p className="text-content-dark font-medium mt-1">---</p>
            )}
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs">
              {t("info.parent")}
            </p>
            <p className="text-content-dark font-medium mt-1">
              {department.parent?.name || t("info.root")}
            </p>
          </div>
        </div>
      </div>

      {department.children && department.children.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-black text-secondary">
            {t("subDepartmentsTitle")}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {department.children.map((child) => (
              <div
                key={child.id}
                onClick={() => router.push(`/departments/${child.id}`)}
                className="bg-card p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
              >
                <div>
                  <h4 className="font-bold text-content-dark">{child.name}</h4>
                  <p className="text-xs text-content-muted mt-1">
                    {child.employeeCount} {t("stats.employees")}
                  </p>
                </div>
                <ChevronRight size={20} className="text-gray-300 rotate-180" />
              </div>
            ))}
          </div>
        </div>
      )}
      <DepartmentModalsContainer />
    </div>
  );
}
