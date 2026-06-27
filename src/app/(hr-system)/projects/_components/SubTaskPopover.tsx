"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import api from "@/lib/axios/core/instance";
import type { Task, CreateTaskPayload } from "../types/project.types";
import { TaskPriority } from "../types/project.types";
import { useCreateSubTask } from "../_hooks/useTasks";

interface SubTaskPopoverProps {
  parentTask: Task;
  onClose: () => void;
}

interface Option {
  id: string;
  name: string;
}

export function SubTaskPopover({ parentTask, onClose }: SubTaskPopoverProps) {
  const t = useTranslations("projects.tasks");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState<number | undefined>();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Option[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);

  const { mutate: createSubTask, isPending: subTaskLoading } = useCreateSubTask(parentTask.id);

  useEffect(() => {
    api.get("/employee")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        const list: Option[] = (Array.isArray(data) ? data : Array.isArray(data?.employees) ? data.employees : [])
          .map((e: Record<string, unknown>) => ({
            id: e.id as string,
            name: (e.name ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`).toString().trim() || "Unknown",
          }));
        setEmployees(list);
      })
      .catch(() => setEmployees([]))
      .finally(() => setLoadingEmployees(false));
  }, []);

  const handleSubmit = () => {
    if (!title.trim()) {
      setValidationError(t("form.titleRequired"));
      return;
    }
    setValidationError(null);
    const payload: CreateTaskPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      estimatedHours: estimatedHours,
      // projectId: parentTask.projectId,
    };
    createSubTask(payload, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-content-dark">
            {t("form.createSubTaskTitle") ?? "New Sub-task"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-content-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            {/* Parent task info */}
            <div className="text-xs text-content-muted bg-gray-50 rounded-xl px-3 py-2">
              {t("subTasks")}: <span className="font-medium text-content-dark">{parentTask.title}</span>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                {t("fields.title")} *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("form.titlePlaceholder")}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                {t("fields.description")}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("form.descriptionPlaceholder")}
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            {/* Priority & Estimated Hours */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  {t("fields.priority")}
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                >
                  {Object.values(TaskPriority).map((p) => (
                    <option key={p} value={p}>
                      {t(`priority.${p}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  {t("fields.estimatedHours")}
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={estimatedHours ?? ""}
                  onChange={(e) => setEstimatedHours(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
              </div>
            </div>

            {/* Due Date & Assignee */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  {t("fields.dueDate")}
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content mb-1">
                  {t("fields.assignee")}
                </label>
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  disabled={loadingEmployees}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{loadingEmployees ? t("loading") : "—"}</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {validationError && (
              <p className="text-sm text-status-error bg-red-50 rounded-lg px-3 py-2">
                {validationError}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 pb-6 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={subTaskLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-content-muted border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t("actions.discard")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={subTaskLoading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-secondary bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {subTaskLoading && <Loader2 size={14} className="animate-spin" />}
            {t("actions.create")}
          </button>
        </div>
      </div>
    </div>
  );
}
