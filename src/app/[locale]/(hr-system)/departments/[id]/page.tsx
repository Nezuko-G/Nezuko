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
  Pencil,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
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
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  if (!department)
    return (
      <div className="flex h-96 items-center justify-center text-status-error font-bold">
        {t("notFound")}
      </div>
    );

  const handleDelete = () => {
    if (department.employeeCount > 0) {
      toast.error(t("errors.notEmpty"));
      return;
    }
    deleteDepartment.mutate(department.id, {
      onSuccess: () => router.push("/departments"),
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-4 md:p-8 text-right">
      <div
        className="flex items-center gap-2 text-content-muted text-sm font-bold mb-1 cursor-pointer"
        onClick={() => router.push("/departments")}
      >
        <span>{t("breadcrumbs.list")}</span>
        <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
        <span className="text-primary">{department.name}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-secondary">
          {department.name}
        </h1>

        <RoleGuard allowedRoles={["HR_ADMIN", "TENANT_OWNER"]}>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-status-error/20 bg-card text-status-error font-bold text-sm shadow-sm hover:bg-status-error/5 transition"
            >
              <Trash2 size={16} />
              {t("actions.delete")}
            </button>
            <button
              onClick={() => openModal("EDIT", department)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-secondary font-bold text-sm shadow hover:opacity-90 transition"
            >
              <Pencil size={16} />
              {t("actions.edit")}
            </button>
          </div>
        </RoleGuard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary/10 text-primary rounded-2xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs uppercase tracking-wider">
              {t("stats.employees")}
            </p>
            <p className="text-3xl font-black text-secondary mt-1">
              {department.employeeCount}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-status-warning/10 text-status-warning rounded-2xl">
            <Network size={24} />
          </div>
          <div>
            <p className="text-content-muted font-bold text-xs uppercase tracking-wider">
              {t("stats.subDepartments")}
            </p>
            <p className="text-3xl font-black text-content-dark">
              {department.children?.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div className="md:col-span-2">
            <p className="text-content-muted font-bold text-xs">
              {t("info.description")}
            </p>
            <p className="text-content-dark font-medium mt-1.5 leading-relaxed">
              {department.description || "---"}
            </p>
          </div>

          <div>
            <p className="text-content-muted font-bold text-xs">
              {t("info.manager")}
            </p>
            <div className="mt-1.5">
              {department.manager ? (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-xl border border-primary/5">
                  <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                    {department.manager.firstName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-secondary">
                    {department.manager.firstName} {department.manager.lastName}
                  </span>
                </div>
              ) : (
                <span className="text-content-muted text-sm font-normal">
                  {t("unassigned") || "---"}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-content-muted font-bold text-xs">
              {t("info.parent")}
            </p>
            <div className="mt-1.5">
              <span className="px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-content-muted text-xs font-medium">
                {department.parent?.name || t("info.root")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {department.children && department.children.length > 0 && (
        <div className="flex flex-col gap-3 pt-2">
          <h3 className="text-lg font-extrabold text-secondary">
            {t("subDepartmentsTitle")}
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {department.children.map((child: any) => (
              <div
                key={child.id}
                onClick={() => router.push(`/departments/${child.id}`)}
                className="bg-card p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary/30 transition-all group"
              >
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                    {child.name}
                  </h4>
                  <p className="text-xs text-content-muted font-medium">
                    {child.employeeCount} {t("stats.employees")}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-400 rtl:rotate-0 ltr:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:-translate-x-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <DepartmentModalsContainer />
    </div>
  );
}
