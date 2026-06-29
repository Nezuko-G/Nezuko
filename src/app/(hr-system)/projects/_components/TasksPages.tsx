"use client";

import { useTranslations } from "next-intl";
import { useMyTasks, useOverdueReport, useUpdateTask } from "../_hooks/useTasks";
import MyTasksTable from "./MyTasksTable";
import { TaskDetailPopover } from "./TaskDetailPopover";
import { TaskForm } from "./TaskForm";
import OverdueTasksTable from "./OverdueTasksTable";
import { TaskListLoader, OverdueReportLoader } from "../loaders/index";
import { useState, useMemo } from "react";
import type { Task } from "../types/project.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../api/api";
import type { UpdateTaskPayload } from "../types/project.types";
import { useAuthStore } from "@/hooks/useAuthStore";

interface MyTasksPageProps {
  currentUserId: string;
}

const PRIORITY_ORDER: Record<string, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

export function MyTasksPage({ }: MyTasksPageProps) {
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
      ) : (
        <MyTasksTable
          tasks={sorted}
          onViewDetail={(task) => setSelectedTaskId(task.id)}
        />
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


interface OverdueReportPageProps {
  currentUserId: string;
}

export function OverdueReportPage({ currentUserId }: OverdueReportPageProps) {
  const tp = useTranslations("projects");
  const { data: groups, isLoading, isError } = useOverdueReport();
  const [selectedTaskId, setSelectedTaskId] = useState<string>();
  const [editingTask, setEditingTask] = useState<Task>();
  const updateTask = useUpdateTask(editingTask?.id ?? "");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-secondary">{tp("tasks.overdueReport.title")}</h1>
      </div>

      {isLoading ? (
        <OverdueReportLoader />
      ) : isError ? (
        <p className="text-sm text-status-error">{tp("tasks.errors.loadFailed")}</p>
      ) : (
        <OverdueTasksTable
          groups={groups}
          currentUserId={currentUserId}
          onViewDetail={(task) => setSelectedTaskId(task.id)}
        />
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
        loading={updateTask.isPending}
        onSubmit={(payload) => {
          if (editingTask) {
            updateTask.mutate(payload);
          }
        }}
        onClose={() => setEditingTask(undefined)}
      />
    </div>
  );
}