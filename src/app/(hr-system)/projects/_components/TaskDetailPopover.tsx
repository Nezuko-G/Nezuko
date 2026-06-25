"use client";

import { useTranslations } from "next-intl";
import { X, Loader2, Calendar, User, Clock, AlertCircle, GitBranch, FileText } from "lucide-react";
import { useTaskById } from "../_hooks/useTasks";
import { TaskStatusBadge, PriorityBadge } from "./Badges";
import { TaskStatus, TaskPriority } from "../types/project.types";
import type { Task } from "../types/project.types";

interface TaskDetailPopoverProps {
  taskId: string;
  onClose: () => void;
  onEdit?: (task: Task) => void;
}

export function TaskDetailPopover({ taskId, onClose, onEdit }: TaskDetailPopoverProps) {
  const t = useTranslations("projects.tasks");
  const { data: task, isLoading, isError } = useTaskById(taskId);

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
            {t("detail.title") ?? "Task Details"}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : isError || !task ? (
            <p className="text-sm text-status-error">{t("errors.loadFailed")}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Title & badges */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-content-dark">{task.title}</h3>
                <div className="flex flex-col items-start gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-content-muted">{t("fields.status")}:</span>
                    <TaskStatusBadge status={task.status ?? TaskStatus.TODO} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-content-muted">{t("fields.priority")}:</span>
                    <PriorityBadge priority={task.priority ?? TaskPriority.MEDIUM} />
                  </div>
                </div>
              </div>

              {/* Description */}
              {task.description && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                    <FileText size={12} />
                    {t("fields.description")}
                  </span>
                  <p className="text-sm text-content bg-gray-50 rounded-xl px-3 py-2 whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3">
                {task.assignee && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                      <User size={12} />
                      {t("fields.assignee")}
                    </span>
                    <span className="text-sm text-content-dark font-medium">{task.assignee.name}</span>
                  </div>
                )}

                {task.project && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                      <GitBranch size={12} />
                      {t("fields.project")}
                    </span>
                    <span className="text-sm text-content-dark font-medium">{task.project.name}</span>
                  </div>
                )}

                {task.dueDate && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                      <Calendar size={12} />
                      {t("fields.dueDate")}
                    </span>
                    <span className={`text-sm font-medium ${new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE ? "text-status-error" : "text-content-dark"}`}>
                      {new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </span>
                  </div>
                )}

                {task.estimatedHours != null && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                      <Clock size={12} />
                      {t("fields.estimatedHours")}
                    </span>
                    <span className="text-sm text-content-dark font-medium">{task.estimatedHours}h</span>
                  </div>
                )}

                {task.actualHours != null && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                      <Clock size={12} />
                      {t("fields.actualHours")}
                    </span>
                    <span className={`text-sm font-medium ${task.actualHours > (task.estimatedHours ?? 0) ? "text-status-error" : "text-status-success"}`}>
                      {task.actualHours}h
                    </span>
                  </div>
                )}

                {task.completedAt && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                      <Calendar size={12} />
                      {t("fields.completedAt") ?? "Completed At"}
                    </span>
                    <span className="text-sm text-content-dark font-medium">
                      {new Date(task.completedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </span>
                  </div>
                )}

                {task.createdBy && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                      <User size={12} />
                      {t("fields.createdBy") ?? "Created By"}
                    </span>
                    <span className="text-sm text-content-dark font-medium">{task.createdBy.name}</span>
                  </div>
                )}
              </div>

              {/* Parent task link */}
              {task.parentTask && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-content-muted flex items-center gap-1">
                    <GitBranch size={12} />
                    {t("fields.parentTask") ?? "Parent Task"}
                  </span>
                  <span className="text-sm text-content-dark font-medium">{task.parentTask.title}</span>
                </div>
              )}

              {/* Subtasks */}
              {task.subTasks && task.subTasks.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-content-muted">
                    {t("subTasks")} ({task.subTasks.length})
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {task.subTasks.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-sm"
                      >
                        <TaskStatusBadge status={sub.status} />
                        <span className="flex-1 min-w-0 truncate text-content-dark">{sub.title}</span>
                        <PriorityBadge priority={sub.priority} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overdue warning */}
              {task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== TaskStatus.DONE && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                    <AlertCircle size={12} />
                    {t("warnings.overdueDate")}
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 px-6 pb-6 pt-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-content-muted border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {t("actions.discard")}
          </button>
          {task && onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-secondary bg-primary hover:bg-primary-hover transition-colors"
            >
              {t("actions.edit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
