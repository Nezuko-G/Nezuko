"use client";

import { useTranslations } from "next-intl";
import { useState, Fragment } from "react";
import { PriorityBadge } from "./Badges";
import { useUpdateTaskStatus } from "../_hooks/useTasks";
import type { Task, OverdueReportGroup } from "../types/project.types";
import { TaskStatus } from "../types/project.types";

interface OverdueTasksTableProps {
  groups: OverdueReportGroup[] | undefined;
  currentUserId: string;
  onViewDetail?: (task: Task) => void;
}

const STATUS_FLOW: TaskStatus[] = [
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
  TaskStatus.BLOCKED,
];

function OverdueTaskRow({
  task,
  currentUserId,
  onViewDetail,
}: {
  task: Task;
  currentUserId: string;
  onViewDetail?: (task: Task) => void;
}) {
  const t = useTranslations("projects.tasks");
  const isAssignee = task.assigneeId === currentUserId;
  const canChangeStatus = isAssignee;
  const { mutate: updateStatus, isPending: statusLoading } = useUpdateTaskStatus(task.id);
  const [localActualHours, setLocalActualHours] = useState<number | undefined>(task.actualHours);

  const handleStatusChange = (status: TaskStatus) => {
    const hasOpenSubTasks = task.subTasks?.some((s) => s.status !== TaskStatus.DONE);
    if (status === TaskStatus.DONE && hasOpenSubTasks) return;
    updateStatus({ status, actualHours: localActualHours });
  };

  const handleHoursBlur = () => {
    if (localActualHours !== task.actualHours) {
      updateStatus({ status: task.status, actualHours: localActualHours });
    }
  };

  const isOverdue =
    task.dueDate &&
    task.status !== TaskStatus.DONE &&
    new Date(task.dueDate) < new Date();

  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group">
      <td className="px-4 py-3 max-w-xs truncate">
        <button
          onClick={() => onViewDetail?.(task)}
          className="text-sm font-semibold text-secondary hover:text-primary transition-colors text-left w-full truncate"
        >
          {task.title}
        </button>
      </td>
      <td className="px-4 py-3">
        <span title={task.project?.name} className="text-sm text-content-muted truncate max-w-30 block">
          {task.project?.name ?? "—"}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <PriorityBadge priority={task.priority} />
      </td>
      <td className="px-4 py-3 text-center">
        <span
          className={`text-sm whitespace-nowrap ${isOverdue ? "text-status-error font-semibold" : "text-content-muted"}`}
        >
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString(undefined, {
                dateStyle: "short",
              })
            : "—"}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        {canChangeStatus ? (
          <div className="flex items-center justify-center gap-1.5">
            <select
              value={task.status}
              disabled={statusLoading}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="appearance-none rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              {STATUS_FLOW.map((s) => (
                <option key={s} value={s}>
                  {t(`status.${s}`)}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              step={0.5}
              value={localActualHours ?? ""}
              onChange={(e) => setLocalActualHours(e.target.value ? Number(e.target.value) : 0)}
              onBlur={handleHoursBlur}
              placeholder="hrs"
              className="w-14 rounded-md border border-gray-200 px-1.5 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-primary/40"
              title={t("fields.actualHours")}
            />
          </div>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
            {t(`status.${task.status}`)}
          </span>
        )}
      </td>
    </tr>
  );
}

export default function OverdueTasksTable({
  groups,
  currentUserId,
  onViewDetail,
}: OverdueTasksTableProps) {
  const t = useTranslations("projects.tasks");

  const validGroups = groups ?? [];

  if (!validGroups.length || !validGroups.some((g) => g.tasks.length)) {
    return (
      <p className="text-sm text-content-muted text-center py-10 bg-white rounded-2xl border border-gray-100">
        {t("overdueReport.noOverdue")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
            <th className="px-4 py-4 text-start">{t("fields.title")}</th>
            <th className="px-4 py-4 text-start whitespace-nowrap">{t("fields.project")}</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">{t("fields.priority")}</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">{t("fields.dueDate")}</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">{t("fields.status")}</th>
          </tr>
        </thead>
        <tbody>
          {validGroups.map((group) => (
            <Fragment key={group.assignee.id}>
              <tr className="bg-primary/20 border border-gray-100">
                <td
                  colSpan={5}
                  className="px-4 py-2.5 text-sm font-semibold text-center text-content-dark border-s-[3px] border-primary/15"
                >
                  {group.assignee.name ?? "—"}
                  <span className="text-content-muted font-normal ms-2">
                    · {group.tasks.length} task{group.tasks.length !== 1 ? "s" : ""}
                  </span>
                </td>
              </tr>
              {group.tasks.map((task) => (
                <OverdueTaskRow
                  key={task.id}
                  task={task}
                  currentUserId={currentUserId}
                  onViewDetail={onViewDetail}
                />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
