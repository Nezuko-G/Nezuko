/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import api from "@/lib/axios/core/instance";
import type { Task, CreateTaskPayload } from "../types/project.types";
import { TaskPriority, TaskStatus } from "../types/project.types";

interface TaskFormProps {
  open: boolean;
  projectId?: string;
  task?: Task;
  parentTaskId?: string;
  loading?: boolean;
  error?: string | null;
  onSubmit: (data: CreateTaskPayload) => void;
  onClose: () => void;
}

const EMPTY: CreateTaskPayload = {
  title: "",
  description: "",
  status: TaskStatus.TODO,
  priority: TaskPriority.MEDIUM,
  dueDate: "",
  estimatedHours: undefined,
};

function buildInitialForm(task?: Task, projectId?: string): CreateTaskPayload {
  if (task) {
    return {
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority,
      assigneeId: task.assigneeId ?? "",
      dueDate: task.dueDate?.slice(0, 10) ?? "",
      estimatedHours: task.estimatedHours,
      // projectId: task.projectId,
    };
  }
  return { ...EMPTY, projectId };
}

interface Option {
  id: string;
  name: string;
}

export function TaskForm({
  open,
  projectId,
  task,
  parentTaskId,
  loading = false,
  error,
  onSubmit,
  onClose,
}: TaskFormProps) {
  const t = useTranslations("projects.tasks");
  const isSubTask = !!parentTaskId;
  const [form, setForm] = useState<CreateTaskPayload>(() =>
    buildInitialForm(task, projectId),
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Option[]>([]);
  const [projects, setProjects] = useState<Option[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => {
    setValidationError(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setLoadingEmployees(true);
    api
      .get("/employee")
      .then((res) => {
        const data = res.data?.data ?? res.data;
        const list: Option[] = (
          Array.isArray(data)
            ? data
            : Array.isArray(data?.employees)
              ? data.employees
              : []
        ).map((e: Record<string, unknown>) => ({
          id: e.id as string,
          name:
            (e.name ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`)
              .toString()
              .trim() || "Unknown",
        }));
        setEmployees(list);
      })
      .catch(() => setEmployees([]))
      .finally(() => setLoadingEmployees(false));
  }, [open]);

  useEffect(() => {
    if (!open || projectId) return;
    setLoadingProjects(true);
    api
      .get("/project")
      .then((res) => {
        const data = res.data?.projects ?? res.data;
        const list: Option[] = (Array.isArray(data) ? data : []).map(
          (p: Record<string, unknown>) => ({
            id: p.id as string,
            name: (p.name as string) ?? "Unknown",
          }),
        );
        setProjects(list);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoadingProjects(false));
  }, [open, projectId]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.title?.trim()) {
      setValidationError(t("form.titleRequired"));
      return;
    }
    setValidationError(null);
    onSubmit({ ...form, parentTaskId });
  };

  const isEdit = !!task;
  const title = isSubTask
    ? t("form.createSubTaskTitle")
    : isEdit
      ? t("form.editTitle")
      : t("form.createTitle");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-content-dark">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-content-muted" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-content mb-1">
              {t("fields.title")} *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder={t("form.titlePlaceholder")}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-content mb-1">
              {t("fields.description")}
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder={t("form.descriptionPlaceholder")}
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                {t("fields.priority")}
              </label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as TaskPriority,
                  }))
                }
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
                value={form.estimatedHours ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    estimatedHours: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  }))
                }
                placeholder="0"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                {t("fields.dueDate")}
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-content mb-1">
                {t("fields.assignee")}
              </label>
              <select
                value={form.assigneeId ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    assigneeId: e.target.value || undefined,
                  }))
                }
                disabled={loadingEmployees}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingEmployees ? t("loading") : "—"}
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!projectId && !isSubTask && (
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                {t("fields.project")}
              </label>
              <select
                value={form.projectId ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    projectId: e.target.value || undefined,
                  }))
                }
                disabled={loadingProjects}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {loadingProjects
                    ? t("loading")
                    : t("form.standaloneOrProject")}
                </option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-content mb-1">
                {t("fields.status")}
              </label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as TaskStatus,
                  }))
                }
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
              >
                {Object.values(TaskStatus).map((s) => (
                  <option key={s} value={s}>
                    {t(`status.${s}`)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {(validationError || error) && (
          <p className="text-sm text-status-error bg-red-50 rounded-lg px-3 py-2">
            {validationError || error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-content-muted border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t("actions.discard")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-secondary bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {isEdit ? t("actions.save") : t("actions.create")}
          </button>
        </div>
      </div>
    </div>
  );
}
