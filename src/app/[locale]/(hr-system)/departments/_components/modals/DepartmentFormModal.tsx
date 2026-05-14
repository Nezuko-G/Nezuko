"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useDepartmentUIStore } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartmentUIStore";
import {
  useDepartmentMutations,
  useDepartments,
} from "@/app/[locale]/(hr-system)/departments/hooks/useDepartments";
import { CreateDepartmentDTO } from "@/types/dto/department.dto";
import { useEmployees } from "@/hooks/use-employee";
import { X, Loader2 } from "lucide-react";
import { z } from "zod";

export default function DepartmentFormModal() {
  const t = useTranslations("departments.modals");
  const { modalType, selectedDepartment, closeModal } = useDepartmentUIStore();
  const { createDepartment, updateDepartment, isLoading } =
    useDepartmentMutations();
    // TODO: (PR Note) Temporary using useEmployees(). Must be updated to use a specific Managers endpoint once implemented.
  const { data: employeesData, isLoading: employeesLoading } = useEmployees();
  const { data: departmentsData, isLoading: departmentsLoading } =
    useDepartments({ limit: 100 });

  const isCreate = modalType === "CREATE";
  const employees = employeesData || [];
  const allDepartments = departmentsData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof CreateDepartmentDTO>>({
    resolver: zodResolver(CreateDepartmentDTO),
  });

  useEffect(() => {
    if (selectedDepartment && !isCreate) {
      reset({
        name: selectedDepartment.name,
        description: selectedDepartment.description || "",
        managerId: selectedDepartment.managerId || "",
        parentId: selectedDepartment.parentId || "",
      });
    } else {
      reset({ name: "", description: "", managerId: "", parentId: "" });
    }
  }, [selectedDepartment, isCreate, reset]);

  const onSubmit = (data: z.infer<typeof CreateDepartmentDTO>) => {
    const payload = {
      ...data,
      managerId: data.managerId || undefined,
      parentId: data.parentId || undefined,
    };

    if (isCreate) {
      createDepartment.mutate(payload);
    } else if (selectedDepartment?.id) {
      updateDepartment.mutate({ id: selectedDepartment.id, data: payload });
    }
  };

  const validParents = allDepartments.filter(
    (d) => d.id !== selectedDepartment?.id,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary-light/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-content-dark">
            {isCreate ? t("title.CREATE") : t("title.EDIT")}
          </h2>
          <button
            onClick={closeModal}
            className="p-1.5 text-content-muted hover:text-status-error rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-5 flex-1 overflow-y-auto space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.name")}
            </label>
            <input
              {...register("name")}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs text-status-error">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-content-dark">
              {t("fields.description")}
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.manager")}
              </label>
              <select
                {...register("managerId")}
                disabled={employeesLoading}
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">
                  {employeesLoading
                    ? t("states.loading")
                    : t("fields.selectManager")}
                </option>
                {employees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-content-dark">
                {t("fields.parent")}
              </label>
              <select
                {...register("parentId")}
                disabled={departmentsLoading}
                className="w-full bg-background border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              >
                <option value="">{t("fields.root")}</option>
                {validParents.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-background/50 rounded-b-2xl">
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 text-content-dark font-bold hover:bg-gray-100 rounded-xl"
          >
            {t("buttons.cancel")}
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="px-5 py-2.5 bg-secondary text-white rounded-xl text-sm font-bold hover:bg-secondary-hover disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isCreate ? t("buttons.create") : t("buttons.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
