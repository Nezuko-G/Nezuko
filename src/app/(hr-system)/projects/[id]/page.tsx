"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, XCircle, TrendingUp, Clock, AlertTriangle, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProject, useProjectProgress, useProjectTasks, useUpdateProject, useCancelProject, projectKeys } from "../_hooks/useProjects";
import { useCreateTask, taskKeys } from "../_hooks/useTasks";
import { tasksApi } from "../api/api";
import { ProjectStatusBadge } from "../_components/Badges";
import { ProjectForm } from "../_components/ProjectForm";
import { TaskForm } from "../_components/TaskForm";
import { CancelProjectDialog } from "../_components/CancelProjectDialog";
import { TaskDetailPopover } from "../_components/TaskDetailPopover";
import ProjectTasksTable from "../_components/ProjectTasksTable";
import { SubTaskPopover } from "../_components/SubTaskPopover";
import { ProjectDetailLoader, TaskListLoader } from "../loaders";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { Task, UpdateTaskPayload } from "../types/project.types";

const MANAGE_ROLES = ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] as const;

export default function ProjectDetailPage() {
    const { id: currentUserId, role } = useAuthStore();
    const canManage = MANAGE_ROLES.includes(role as typeof MANAGE_ROLES[number]);
    const { id } = useParams<{ id: string }>();
    const t = useTranslations("projects");

    const [formOpen, setFormOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [taskFormOpen, setTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task>();
    const [selectedTaskId, setSelectedTaskId] = useState<string>();
    const [taskPage, setTaskPage] = useState(1);
    const [subTaskParent, setSubTaskParent] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch] = useDebounce(searchQuery, 500);

    const queryClient = useQueryClient();
    const { mutate: updateTask, isPending: taskUpdating } = useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskPayload }) =>
            tasksApi.update(taskId, data),
        onSuccess: (task) => {
            if (task.projectId) {
                queryClient.invalidateQueries({ queryKey: projectKeys.tasks(task.projectId) });
                queryClient.invalidateQueries({ queryKey: projectKeys.progress(task.projectId) });
            }
            queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
            setEditingTask(undefined);
        },
    });

    const { data: project, isLoading: projectLoading } = useProject(id);
    const { data: progress } = useProjectProgress(id);
    const { data: tasksData, isLoading: tasksLoading } = useProjectTasks(id, taskPage, 10, debouncedSearch || undefined);
    const tasks = tasksData?.tasks ?? [];
    const lastPage = tasksData?.meta?.totalPages ?? 1;

    const { mutate: updateProject, isPending: updating, error: updateError } =
        useUpdateProject(id);
    const { mutate: cancelProject, isPending: cancelling } = useCancelProject(id);
    const { mutate: createTask, isPending: taskCreating, error: taskCreateError } = useCreateTask();

    if (projectLoading) return <ProjectDetailLoader />;
    if (!project) return <p className="text-sm text-status-error">{t("errors.loadFailed")}</p>;

    const varianceSign = (progress?.hoursVariance ?? 0) >= 0 ? "+" : "";

    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6">
            {/* Back */}
            <Link
                href="/projects"
                className="flex items-center gap-1.5 text-sm text-content-muted hover:text-primary transition-colors w-fit"
            >
                <ArrowLeft size={14} />
                {t("title")}
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-secondary">{project.name}</h1>
                        <ProjectStatusBadge status={project.status} />
                    </div>
                    {project.description && (
                        <p className="text-sm text-content-muted max-w-xl">{project.description}</p>
                    )}
                </div>
                {canManage && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={() => setFormOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            <Pencil size={13} />
                            {t("actions.edit")}
                        </button>
                        <button
                            onClick={() => setCancelOpen(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 text-status-error text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                            <XCircle size={13} />
                            {t("actions.cancel")}
                        </button>
                    </div>
                )}
            </div>

            {/* Progress stats */}
            {progress && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Completion */}
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-content-muted text-xs font-medium">
                            <TrendingUp size={13} />
                            {t("detail.progress")}
                        </div>
                        <p className="text-2xl font-black text-secondary">{progress.completionPercentage}%</p>
                        <p className="text-xs text-content-muted">
                            {t("detail.completedOf", {
                                completed: progress.completedCount,
                                total: progress.totalCount,
                            })}
                        </p>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden mt-1">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-700"
                                style={{ width: `${progress.completionPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Overdue */}
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-content-muted text-xs font-medium">
                            <AlertTriangle size={13} />
                            {t("detail.overdueCount")}
                        </div>
                        <p
                            className={`text-2xl font-black ${(progress.overdueCount ?? 0) > 0 ? "text-status-error" : "text-secondary"
                                }`}
                        >
                            {progress.overdueCount ?? 0}
                        </p>
                    </div>

                    {/* Hours */}
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-content-muted text-xs font-medium">
                            <Clock size={13} />
                            {t("detail.hours")}
                        </div>
                        <p className="text-2xl font-black text-secondary">
                            {progress.actualHours ?? 0}h / {progress.estimatedHours ?? 0}h
                        </p>
                        <p
                            className={`text-xs ${(progress.hoursVariance ?? 0) <= 0 ? "text-status-success" : "text-status-error"}`}
                        >
                            Δ {varianceSign}
                            {(progress.hoursVariance ?? 0).toFixed(1)}h
                        </p>
                    </div>
                </div>
            )}

            {/* Tasks */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-bold text-secondary">
                        {t("detail.tasks")}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setTaskPage(1);
                                }}
                                placeholder={t("searchPlaceholder") ?? "Search..."}
                                className="w-48 ps-9 pe-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition text-xs font-medium"
                            />
                            <Search
                                size={13}
                                className="absolute start-3 top-1/2 -translate-y-1/2 text-content-muted"
                            />
                        </div>
                        {canManage && (
                            <button
                                onClick={() => setTaskFormOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-secondary text-xs font-semibold transition-colors"
                            >
                                <Plus size={13} />
                                {t("tasks.newTask")}
                            </button>
                        )}
                    </div>
                </div>
                {tasksLoading ? (
                    <TaskListLoader />
                ) : (
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <ProjectTasksTable
                            tasks={tasks}
                            canManage={canManage}
                            onViewDetail={(task) => setSelectedTaskId(task.id)}
                            onEdit={setEditingTask}
                            onAddSubTask={setSubTaskParent}
                        />

                        {!tasks.length && !tasksLoading && (
                            <p className="text-sm text-content-muted text-center py-8">
                                {t("detail.noTasks")}
                            </p>
                        )}

                        {lastPage > 1 && (
                            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-center gap-4 bg-gray-50/50">
                                <p className="text-sm text-content-muted font-bold">
                                    {t("pagination", { current: taskPage, total: lastPage })}
                                </p>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        disabled={taskPage >= lastPage}
                                        onClick={() => setTaskPage((p) => p + 1)}
                                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                    <button
                                        disabled={taskPage <= 1}
                                        onClick={() => setTaskPage((p) => p - 1)}
                                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit form */}
            <ProjectForm
                open={formOpen}
                project={project}
                loading={updating}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                error={(updateError as any)?.message ?? null}
                onSubmit={(payload) => updateProject(payload, { onSuccess: () => setFormOpen(false) })}
                onClose={() => setFormOpen(false)}
            />

            {/* Cancel dialog */}
            <CancelProjectDialog
                open={cancelOpen}
                projectName={project.name}
                loading={cancelling}
                onConfirm={() =>
                    cancelProject(undefined, { onSuccess: () => setCancelOpen(false) })
                }
                onClose={() => setCancelOpen(false)}
            />

            {/* Task Form (create) */}
            <TaskForm
                open={taskFormOpen}
                projectId={id}
                loading={taskCreating}
                error={(taskCreateError as { message?: string })?.message ?? null}
                onSubmit={(payload) =>
                    createTask(payload, { onSuccess: () => setTaskFormOpen(false) })
                }
                onClose={() => setTaskFormOpen(false)}
            />

            {/* Task Form (edit) */}
            <TaskForm
                key={editingTask?.id ?? "edit"}
                open={!!editingTask}
                task={editingTask}
                loading={taskUpdating}
                onSubmit={(payload) =>
                    updateTask({ taskId: editingTask!.id, data: payload }, { onSuccess: () => setEditingTask(undefined) })
                }
                onClose={() => setEditingTask(undefined)}
            />

            {/* Sub-task Popover */}
            {subTaskParent && (
                <SubTaskPopover
                    parentTask={subTaskParent}
                    onClose={() => setSubTaskParent(null)}
                />
            )}

            {/* Task Detail Popover */}
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
        </div>
    );
}