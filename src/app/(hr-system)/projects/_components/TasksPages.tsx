"use client";

import { useTranslations } from "next-intl";
import { useMyTasks, useOverdueReport } from "../_hooks/useTasks";
import { TaskRow } from "./TaskRow";
import { TaskDetailPopover } from "./TaskDetailPopover";
import { TaskForm } from "./TaskForm";
import { TaskListLoader, OverdueReportLoader } from "../loaders/index";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { OverdueReportGroup, Task, UpdateTaskPayload } from "../types/project.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/api";
import { useAuthStore } from "@/hooks/useAuthStore";

interface MyTasksPageProps {
  currentUserId: string;
}

const PRIORITY_ORDER: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export function MyTasksPage({ currentUserId }: MyTasksPageProps) {
  const tp = useTranslations("projects");
  const { role } = useAuthStore();
  const canEdit = role !== "EMPLOYEE";
  const { data: tasks, isLoading, isError } = useMyTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [editingTask, setEditingTask] = useState<Task>();
  const queryClient = useQueryClient();
  const { mutate: updateTask, isPending: taskUpdating } = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskPayload }) =>
      tasksApi.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "me"] });
      setEditingTask(undefined);
    },
  });

  const sorted = useMemo(() => {
    if (!tasks) return [];
    return [...tasks].sort((a, b) => {
      const pa = PRIORITY_ORDER[a.priority] ?? 99;
      const pb = PRIORITY_ORDER[b.priority] ?? 99;
      if (pa !== pb) return pa - pb;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-black text-secondary">{tp("tasks.myTasks")}</h1>

      {isLoading ? (
        <TaskListLoader />
      ) : isError ? (
        <p className="text-sm text-status-error">{tp("tasks.errors.loadFailed")}</p>
      ) : !sorted.length ? (
        <p className="text-sm text-content-muted text-center py-10 bg-white rounded-2xl border border-gray-100">
          {tp("tasks.noTasks")}
        </p>
      ) : (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
          {sorted.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              currentUserId={currentUserId}
              canManage={false}
              disableStatusChange={true}
              onViewDetail={(task) => setSelectedTaskId(task.id)}
            />
          ))}
        </div>
      )}

      {selectedTaskId && (
        <TaskDetailPopover
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(undefined)}
          onEdit={canEdit ? (task) => {
            setSelectedTaskId(undefined);
            setEditingTask(task);
          } : undefined}
        />
      )}

      {canEdit && (
        <TaskForm
          key={editingTask?.id ?? "create"}
          open={!!editingTask}
          task={editingTask}
          loading={taskUpdating}
          onSubmit={(payload) => {
            if (editingTask) {
              updateTask({ taskId: editingTask.id, data: payload });
            }
          }}
          onClose={() => setEditingTask(undefined)}
        />
      )}
    </div>
  );
}


interface OverdueGroupProps {
  group: OverdueReportGroup;
  currentUserId: string;
  onViewDetail?: (task: Task) => void;
}

function OverdueGroup({ group, currentUserId, onViewDetail }: OverdueGroupProps) {
  const tp = useTranslations("projects");
  const [expanded, setExpanded] = useState(true);

  const assigneeName = (group as { assigneeName?: string }).assigneeName ?? group.assignee?.name ?? "Unknown";
  const assigneeInitial = assigneeName.charAt(0).toUpperCase();

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Group header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-xs font-bold text-secondary flex-shrink-0">
          {assigneeInitial}
        </div>
        <span className="font-semibold text-content-dark text-sm">{assigneeName}</span>
        <span className="ms-auto text-xs text-content-muted">
          {tp("tasks.overdueReport.taskCount", { count: group.tasks?.length ?? 0 })}
        </span>
        {expanded ? (
          <ChevronDown size={14} className="text-content-muted" />
        ) : (
          <ChevronRight size={14} className="text-content-muted" />
        )}
      </button>

      {/* Tasks */}
      {expanded && !!group.tasks?.length && (
        <div className="divide-y divide-gray-50">
          {group.tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              currentUserId={currentUserId}
              canManage={false}
              onViewDetail={onViewDetail}
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
  const tp = useTranslations("projects");
  const { data: groups, isLoading, isError } = useOverdueReport();
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [editingTask, setEditingTask] = useState<Task>();
  const queryClient = useQueryClient();
  const { mutate: updateTask, isPending: taskUpdating } = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskPayload }) =>
      tasksApi.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", "me"] });
      setEditingTask(undefined);
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-secondary">{tp("tasks.overdueReport.title")}</h1>
        <span className="text-sm text-content-muted">{tp("tasks.overdueReport.groupedByAssignee")}</span>
      </div>

      {isLoading ? (
        <OverdueReportLoader />
      ) : isError ? (
        <p className="text-sm text-status-error">{tp("tasks.errors.loadFailed")}</p>
      ) : !groups?.length ? (
        <p className="text-sm text-content-muted text-center py-10 bg-white rounded-2xl border border-gray-100">
          {tp("tasks.overdueReport.noOverdue")}
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group, idx) => (
            <OverdueGroup
              key={(group as { assigneeId?: string }).assigneeId ?? group.assignee?.id ?? String(idx)}
              group={group}
              currentUserId={currentUserId}
              onViewDetail={(task) => setSelectedTaskId(task.id)}
            />
          ))}
        </div>
      )}

      {selectedTaskId && (
        <TaskDetailPopover
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(undefined)}
          onEdit={(task) => {
            setSelectedTaskId(undefined);
            setEditingTask(task);
          }}
        />
      )}

      <TaskForm
        key={editingTask?.id ?? "create"}
        open={!!editingTask}
        task={editingTask}
        loading={taskUpdating}
        onSubmit={(payload) => {
          if (editingTask) {
            updateTask({ taskId: editingTask.id, data: payload });
          }
        }}
        onClose={() => setEditingTask(undefined)}
      />
    </div>
  );
}