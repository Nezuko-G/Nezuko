"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Pencil, XCircle, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useProject, useProjectProgress, useUpdateProject, useCancelProject } from "../_hooks/useProjects";
import { useCreateTask } from "../_hooks/useTasks";
import { useProjectTasks } from "../_hooks/useProjects";
import { ProjectStatusBadge } from "../_components/Badges";
import { ProjectForm } from "../_components/ProjectForm";
import { CancelProjectDialog } from "../_components/CancelProjectDialog";
import { TaskRow } from "../_components/TaskRow";
import { ProjectDetailLoader, TaskListLoader } from "../loaders";

interface ProjectDetailPageProps {
    currentUserId: string;
    canManage: boolean;
}

export default function ProjectDetailPage({
    currentUserId,
    canManage,
}: ProjectDetailPageProps) {
    const { id } = useParams<{ id: string }>();
    const t = useTranslations("projects");

    const [formOpen, setFormOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);

    const { data: project, isLoading: projectLoading } = useProject(id);
    const { data: progress } = useProjectProgress(id);
    const { data: tasks, isLoading: tasksLoading } = useProjectTasks(id);

    const { mutate: updateProject, isPending: updating, error: updateError } =
        useUpdateProject(id);
    const { mutate: cancelProject, isPending: cancelling } = useCancelProject(id);

    if (projectLoading) return <ProjectDetailLoader />;
    if (!project) return <p className="text-sm text-status-error">{t("errors.loadFailed")}</p>;

    const completedCount = progress?.completedCount ?? 0;
    const totalCount = progress?.totalCount ?? 0;
    const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const hoursVariance = progress?.hoursVariance ?? 0;
    const varianceSign = hoursVariance >= 0 ? "+" : "";

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
                        <p className="text-2xl font-black text-secondary">{completionPct}%</p>
                        <p className="text-xs text-content-muted">
                            {t("detail.completedOf", {
                                completed: completedCount,
                                total: totalCount,
                            })}
                        </p>
                        <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden mt-1">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-700"
                                style={{ width: `${completionPct}%` }}
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

                    {/* Hours variance */}
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-content-muted text-xs font-medium">
                            <Clock size={13} />
                            {t("detail.hoursVariance")}
                        </div>
                        <p
                            className={`text-2xl font-black ${hoursVariance > 0 ? "text-status-error" : "text-status-success"
                                }`}
                        >
                            {varianceSign}
                            {hoursVariance.toFixed(1)}h
                        </p>
                    </div>
                </div>
            )}

            {/* Tasks */}
            <div>
                <h2 className="text-base font-bold text-secondary mb-3">
                    {t("detail.tasks")}
                </h2>
                {tasksLoading ? (
                    <TaskListLoader />
                ) : !tasks?.length ? (
                    <p className="text-sm text-content-muted text-center py-8 bg-white rounded-2xl border border-gray-100">
                        {t("detail.noTasks")}
                    </p>
                ) : (
                    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                        {tasks.map((task) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                currentUserId={currentUserId}
                                canManage={canManage}
                            />
                        ))}
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
        </div>
    );
}