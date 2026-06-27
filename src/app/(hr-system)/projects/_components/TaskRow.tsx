"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, AlertCircle } from "lucide-react";
import { TaskStatusBadge, PriorityBadge } from "./Badges";
import type { Task } from "../types/project.types";
import { TaskStatus } from "../types/project.types";
import { useUpdateTaskStatus, useCreateSubTask } from "../_hooks/useTasks";

interface TaskRowProps {
  task: Task;
  currentUserId: string;
  /** true = Manager/HR */
  canManage: boolean;
  onEdit?: (task: Task) => void;
  onViewDetail?: (task: Task) => void;
  onAddSubTask?: (task: Task) => void;
  depth?: number;
  disableStatusChange?: boolean;
}

const STATUS_FLOW: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.BLOCKED,
];

export function TaskRow({
  task,
  currentUserId,
  canManage,
  onEdit,
  onViewDetail,
  onAddSubTask,
  depth = 0,
  disableStatusChange = false,
}: TaskRowProps) {
  const t = useTranslations("projects.tasks");
  const [expanded, setExpanded] = useState(false);
  const [addingSubTask, setAddingSubTask] = useState(false);
  const [subTaskTitle, setSubTaskTitle] = useState("");

  const isAssignee = task.assigneeId === currentUserId;
  const canChangeStatus = (canManage || isAssignee) && !disableStatusChange;
  const isOverdue =
    task.dueDate &&
    task.status !== TaskStatus.DONE &&
    new Date(task.dueDate) < new Date();

  const hasOpenSubTasks = task.subTasks?.some(
    (s) => s.status !== TaskStatus.DONE,
  );

  const { mutate: updateStatus, isPending: statusLoading } =
    useUpdateTaskStatus(task.id);
  const { mutate: createSubTask, isPending: subTaskLoading } = useCreateSubTask(
    task.id,
    { parentDepth: depth },
  );

  const handleStatusChange = (status: TaskStatus) => {
    if (status === TaskStatus.DONE && hasOpenSubTasks) return;
    updateStatus({ status });
  };

  const handleAddSubTask = () => {
    if (!subTaskTitle.trim()) return;
    createSubTask(
      { title: subTaskTitle, projectId: task.projectId },
      {
        onSuccess: () => {
          setSubTaskTitle("");
          setAddingSubTask(false);
        },
      },
    );
  };

  const hasSubTasks = !!task.subTasks?.length;

  return (
    <div className={depth > 0 ? "ms-6 border-s-2 border-gray-100 ps-3" : ""}>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors rounded-xl group">
        {/* Expand toggle */}
        {hasSubTasks ? (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-content-muted hover:text-content transition-colors"
          >
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <span className="w-3.5" />
        )}

        {/* Title */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => onViewDetail?.(task)}
            className="text-sm font-medium text-content-dark truncate hover:text-primary transition-colors text-start w-full"
          >
            {task.title}
          </button>
          {task.assignee && (
            <p className="text-xs text-content-muted truncate">
              {task.assignee.name}
            </p>
          )}
        </div>

        {/* Priority */}
        <PriorityBadge priority={task.priority} />

        {/* Due date */}
        <span
          className={`text-xs whitespace-nowrap ${
            isOverdue ? "text-status-error font-semibold" : "text-content-muted"
          }`}
        >
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString(undefined, {
                dateStyle: "short",
              })
            : "—"}
        </span>

        {/* Status dropdown */}
        {canChangeStatus ? (
          <div className="relative">
            <select
              value={task.status}
              disabled={statusLoading}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="appearance-none rounded-full border-0 bg-transparent text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 pe-4"
            >
              {STATUS_FLOW.map((s) => (
                <option
                  key={s}
                  value={s}
                  disabled={s === TaskStatus.DONE && !!hasOpenSubTasks}
                >
                  {t(`status.${s}`)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <TaskStatusBadge status={task.status} />
        )}

        {/* Open sub-tasks warning */}
        {/*{hasOpenSubTasks && task.status !== TaskStatus.DONE && (
          <div className="ms-9 mb-1 flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5">
            <AlertCircle size={12} />
            {t("warnings.openSubTasks")}
          </div>
        )}*/}

        {/* Manager edit */}
        {canManage && (
          <button
            onClick={() => onEdit?.(task)}
            className="text-xs text-content-muted hover:text-primary transition-colors"
          >
            {t("actions.edit")}
          </button>
        )}
      </div>

      {/* Sub-tasks */}
      {expanded && hasSubTasks && (
        <div className="flex flex-col">
          {task.subTasks!.map((sub) => (
            <TaskRow
              key={sub.id}
              task={sub}
              currentUserId={currentUserId}
              canManage={canManage}
              onEdit={onEdit}
              onViewDetail={onViewDetail}
              disableStatusChange={disableStatusChange}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {/* Add sub-task (Manager only, no nesting below depth 0) */}
      {canManage && depth === 0 && (
        <div className="ms-9 mb-2">
          {onAddSubTask ? (
            <button
              onClick={() => onAddSubTask(task)}
              className="flex items-center gap-1 text-xs text-content-muted hover:text-primary transition-colors"
            >
              <Plus size={12} />
              {t("addSubTask")}
            </button>
          ) : addingSubTask ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={subTaskTitle}
                onChange={(e) => setSubTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSubTask()}
                placeholder={t("form.titlePlaceholder")}
                className="flex-1 rounded-lg border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={handleAddSubTask}
                disabled={subTaskLoading}
                className="text-xs font-semibold text-secondary bg-primary hover:bg-primary-hover px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
              >
                {t("actions.create")}
              </button>
              <button
                onClick={() => setAddingSubTask(false)}
                className="text-xs text-content-muted hover:text-content"
              >
                {t("actions.discard")}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingSubTask(true)}
              className="flex items-center gap-1 text-xs text-content-muted hover:text-primary transition-colors"
            >
              <Plus size={12} />
              {t("addSubTask")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
