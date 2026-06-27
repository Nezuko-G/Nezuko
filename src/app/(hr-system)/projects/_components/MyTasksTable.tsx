"use client";

import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TaskStatusBadge, PriorityBadge } from "./Badges";
import type { Task } from "../types/project.types";

interface MyTasksTableProps {
  tasks: Task[];
  onViewDetail?: (task: Task) => void;
}

export default function MyTasksTable({
  tasks,
  onViewDetail,
}: MyTasksTableProps) {
  const t = useTranslations("projects.tasks");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(() =>
    new Set(tasks.filter((t) => t.subTasks?.length).map((t) => t.id))
  );

  const toggleExpanded = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  if (!tasks.length) {
    return (
      <p className="text-sm text-content-muted text-center py-10 bg-white rounded-2xl border border-gray-100">
        {t("noTasks") ?? "No tasks found"}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
            <th className="px-4 py-4 text-start w-8" />
            <th className="px-4 py-4 text-start">{t("fields.title")}</th>
            <th className="px-4 py-4 text-start whitespace-nowrap">{t("fields.project")}</th>
            <th className="px-4 py-4 text-start whitespace-nowrap">{t("fields.createdBy")}</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">{t("fields.priority")}</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">{t("fields.schedule")}</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">{t("fields.status")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {tasks.map((task) => {
            const isOverdue =
              task.dueDate &&
              task.status !== "DONE" &&
              new Date(task.dueDate) < new Date();

            const hasSubTasks = !!task.subTasks?.length;
            const isExpanded = expandedTasks.has(task.id);

            return (
              <Fragment key={task.id}>
                <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors group">
                  <td className="px-4 py-3">
                    {hasSubTasks ? (
                      <button
                        onClick={() => toggleExpanded(task.id)}
                        className="text-content-muted hover:text-content transition-colors"
                      >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    ) : (
                      <span className="w-3.5 block" />
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    <button
                      onClick={() => onViewDetail?.(task)}
                      className="text-sm font-semibold text-secondary hover:text-primary transition-colors text-left w-full"
                    >
                      {task.title}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-content-muted whitespace-nowrap">
                      {task.project?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-content-muted truncate max-w-[120px] block">
                      {task.createdBy?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-sm whitespace-nowrap ${isOverdue ? "text-status-error font-semibold" : "text-content-muted"}`}
                      >
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString(undefined, {
                              dateStyle: "short",
                            })
                          : "—"}
                      </span>
                      {(task.estimatedHours != null || task.actualHours != null) && (
                        <span className="text-xs text-content-muted/60 whitespace-nowrap mt-0.5">
                          {task.estimatedHours ?? "?"}h / {task.actualHours ?? "?"}h
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <TaskStatusBadge status={task.status} />
                  </td>
                </tr>
                {isExpanded && hasSubTasks && task.subTasks!.map((sub) => {
                  const subIsOverdue =
                    sub.dueDate &&
                    sub.status !== "DONE" &&
                    new Date(sub.dueDate) < new Date();

                  return (
                    <tr
                      key={sub.id}
                      className="bg-gray-50/40 border-b border-gray-50 last:border-0"
                    >
                      <td />
                    <td className="px-4 py-2.5 max-w-[200px] truncate">
                      <div className="flex items-center gap-2 ms-5 border-s-2 border-gray-200 ps-3">
                        <button
                          onClick={() => onViewDetail?.(sub)}
                          className="text-sm font-medium text-secondary hover:text-primary transition-colors text-left truncate"
                        >
                          {sub.title}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-sm text-content-muted whitespace-nowrap">
                        {sub.project?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-sm text-content-muted truncate max-w-[100px] block">
                        {sub.createdBy?.name ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <PriorityBadge priority={sub.priority} />
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-sm whitespace-nowrap ${subIsOverdue ? "text-status-error font-semibold" : "text-content-muted"}`}
                        >
                          {sub.dueDate
                            ? new Date(sub.dueDate).toLocaleDateString(undefined, {
                                dateStyle: "short",
                              })
                            : "—"}
                        </span>
                        {(sub.estimatedHours != null || sub.actualHours != null) && (
                          <span className="text-xs text-content-muted/60 whitespace-nowrap mt-0.5">
                            {sub.estimatedHours ?? "?"}h / {sub.actualHours ?? "?"}h
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <TaskStatusBadge status={sub.status} />
                    </td>
                    </tr>
                  );
                })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
