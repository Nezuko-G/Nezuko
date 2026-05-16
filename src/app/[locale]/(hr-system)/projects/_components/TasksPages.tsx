"use client";

import { useTranslations } from "next-intl";
import { useMyTasks, useOverdueReport } from "../_hooks/useTasks";
import { TaskRow } from "./TaskRow";
import { TaskListLoader, OverdueReportLoader } from "../loaders/index";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { OverdueReportGroup } from "../types/project.types";

interface MyTasksPageProps {
  currentUserId: string;
}

export function MyTasksPage({ currentUserId }: MyTasksPageProps) {
  const t = useTranslations("tasks");
  const { data: tasks, isLoading, isError } = useMyTasks();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-black text-secondary">{t("myTasks")}</h1>

      {isLoading ? (
        <TaskListLoader />
      ) : isError ? (
        <p className="text-sm text-status-error">{t("errors.loadFailed")}</p>
      ) : !tasks?.length ? (
        <p className="text-sm text-content-muted text-center py-10 bg-white rounded-2xl border border-gray-100">
          {t("noTasks")}
        </p>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              currentUserId={currentUserId}
              canManage={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}


interface OverdueGroupProps {
  group: OverdueReportGroup;
  currentUserId: string;
}

function OverdueGroup({ group, currentUserId }: OverdueGroupProps) {
  const t = useTranslations("tasks.overdueReport");
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Group header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-bold text-secondary flex-shrink-0">
          {group.assignee.name.charAt(0).toUpperCase()}
        </div>
        <span className="font-semibold text-content-dark text-sm">{group.assignee.name}</span>
        <span className="ms-auto text-xs text-content-muted">
          {t("taskCount").replace("{count}", String(group.tasks.length))}
        </span>
        {expanded ? (
          <ChevronDown size={14} className="text-content-muted" />
        ) : (
          <ChevronRight size={14} className="text-content-muted" />
        )}
      </button>

      {/* Tasks */}
      {expanded && (
        <div className="divide-y divide-gray-50">
          {group.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              currentUserId={currentUserId}
              canManage={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface OverdueReportPageProps {
  currentUserId: string;
}

export function OverdueReportPage({ currentUserId }: OverdueReportPageProps) {
  const t = useTranslations("tasks.overdueReport");
  const { data: groups, isLoading, isError } = useOverdueReport();
  const tErrors = useTranslations("tasks.errors");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-secondary">{t("title")}</h1>
        <span className="text-sm text-content-muted">{t("groupedByAssignee")}</span>
      </div>

      {isLoading ? (
        <OverdueReportLoader />
      ) : isError ? (
        <p className="text-sm text-status-error">{tErrors("loadFailed")}</p>
      ) : !groups?.length ? (
        <p className="text-sm text-content-muted text-center py-10 bg-white rounded-2xl border border-gray-100">
          {t("noOverdue")}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <OverdueGroup
              key={group.assignee.id}
              group={group}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}