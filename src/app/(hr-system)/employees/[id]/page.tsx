"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ListTodo, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmployee } from "../hooks/useEmployees";
import { useEmployeeTasks } from "../../projects/_hooks/useTasks";
import { useAuthStore } from "@/hooks/useAuthStore";
import ProjectTasksTable from "../../projects/_components/ProjectTasksTable";
import { TaskDetailPopover } from "../../projects/_components/TaskDetailPopover";
import { SubTaskPopover } from "../../projects/_components/SubTaskPopover";
import { TaskForm } from "../../projects/_components/TaskForm";
import type { Task, UpdateTaskPayload } from "../../projects/types/project.types";
import { TaskStatus } from "../../projects/types/project.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi } from "../../projects/api/api";
import { projectKeys } from "../../projects/_hooks/useProjects";
import { taskKeys } from "../../projects/_hooks/useTasks";
import ProfileSections from "./components/ProfileSections";

const MANAGE_ROLES = ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] as const;

export default function EmployeeProfilePage() {
    const t = useTranslations("employees.profile");
    const { id: currentUserId, role } = useAuthStore();
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data, isLoading } = useEmployee(id);
    const { data: tasks = [], isLoading: tasksLoading } = useEmployeeTasks(id);

    const [selectedTaskId, setSelectedTaskId] = useState<string>();
    const [editingTask, setEditingTask] = useState<Task>();
    const [subTaskParent, setSubTaskParent] = useState<Task | null>(null);

    const canManage = MANAGE_ROLES.includes(role as typeof MANAGE_ROLES[number]);
    const queryClient = useQueryClient();

    const { mutate: updateTask, isPending: taskUpdating } = useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskPayload }) =>
            tasksApi.update(taskId, data),
        onSuccess: (task) => {
            if (task.projectId) {
                queryClient.invalidateQueries({ queryKey: projectKeys.tasks(task.projectId) });
            }
            queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
            queryClient.invalidateQueries({ queryKey: taskKeys.byUser(id) });
            setEditingTask(undefined);
        },
    });

    const emp = data?.data;

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        tasks.forEach((t) => {
            counts[t.status] = (counts[t.status] ?? 0) + 1;
        });
        return counts;
    }, [tasks]);

    if (isLoading) return <div className="p-8 text-center text-content-muted">{t("loading")}</div>;
    if (!emp) return <div className="p-8 text-center text-content-muted">{t("notFound")}</div>;

    const initials = `${emp.firstName[0]}${emp.lastName[0]}`;
    const isTerminated = emp.status === "TERMINATED";

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-6">
            <button
                onClick={() => router.push("/employees")}
                className="flex items-center gap-2 text-content-muted hover:text-secondary text-sm font-semibold transition w-fit"
            >
                <ArrowLeft size={16} /> {t("back")}
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-64 shrink-0 bg-card rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4 self-start">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-2xl">
                        {initials}
                    </div>
                    <div className="text-center">
                        <p className="font-extrabold text-secondary text-lg">{emp.firstName} {emp.lastName}</p>
                        <p className="text-content-muted text-sm">{emp.jobTitle}</p>
                        <p className="text-xs text-content-muted mt-1">{emp.email}</p>
                    </div>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        isTerminated ? "bg-status-error/10 text-status-error" : "bg-status-success/10 text-status-success"
                    )}>
                        {t(`status.${emp.status.toLowerCase()}`)}
                    </span>
                    <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-2 text-xs text-content-muted">
                        <p><span className="font-semibold text-secondary">{t("fields.code")}: </span><span className="font-mono">{emp.employeeCode ?? "—"}</span></p>
                        <p><span className="font-semibold text-secondary">{t("fields.department")}: </span>{emp.department?.name ?? "—"}</p>
                        <p><span className="font-semibold text-secondary">{t("fields.hireDate")}: </span>{emp.hireDate ?? "—"}</p>
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-6">
                    <ProfileSections employee={emp} readOnly={isTerminated} />

                    {/* Tasks */}
                    <div className="bg-card rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 px-6 pt-5 pb-3">
                            <ListTodo size={16} className="text-content-muted" />
                            <h2 className="text-base font-bold text-secondary">
                                {t("tasks") ?? "Tasks"}
                            </h2>
                            <span className="text-xs text-content-muted">({tasks.length})</span>
                        </div>

                        {/* Status summary chips */}
                        {tasks.length > 0 && (
                            <div className="flex flex-wrap gap-2 px-6 pb-4">
                                {Object.entries(statusCounts).map(([status, count]) => (
                                    <span
                                        key={status}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-content-muted"
                                    >
                                        {status === TaskStatus.DONE ? (
                                            <CheckCircle2 size={12} className="text-status-success" />
                                        ) : status === TaskStatus.IN_PROGRESS ? (
                                            <Clock size={12} className="text-blue-500" />
                                        ) : (
                                            <AlertTriangle size={12} className="text-amber-500" />
                                        )}
                                        {count} {status.replace("_", " ")}
                                    </span>
                                ))}
                            </div>
                        )}

                        {tasksLoading ? (
                            <p className="text-sm text-content-muted text-center py-8">{t("loading")}</p>
                        ) : (
                            <ProjectTasksTable
                                tasks={tasks}
                                canManage={canManage}
                                showProject={true}
                                onViewDetail={(task) => setSelectedTaskId(task.id)}
                                onEdit={setEditingTask}
                                onAddSubTask={setSubTaskParent}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Task Detail */}
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

            {/* Task Form (edit) */}
            <TaskForm
                key={editingTask?.id ?? "edit"}
                open={!!editingTask}
                task={editingTask}
                loading={taskUpdating}
                onSubmit={(payload) =>
                    updateTask({ taskId: editingTask!.id, data: payload })
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
        </div>
    );
}
