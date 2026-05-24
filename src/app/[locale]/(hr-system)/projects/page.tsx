"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useProjects, useCreateProject, useUpdateProject, useCancelProject } from "./_hooks/useProjects";
import { ProjectCard } from "./_components/ProjectCard";
import { ProjectForm } from "./_components/ProjectForm";
import { CancelProjectDialog } from "./_components/CancelProjectDialog";
import { ProjectListLoader } from "./loaders/index";
import type { Project, ProjectFilters } from "./types/project.types";
import { ProjectStatus } from "./types/project.types";

interface ProjectsPageProps {
    currentUserId: string;
    canManage: boolean;
}

export default function ProjectsPage({ currentUserId, canManage }: ProjectsPageProps) {
    const t = useTranslations("projects");

    const [filters, setFilters] = useState<ProjectFilters>({});
    const [searchQuery, setSearchQuery] = useState("");

    // Create / Edit dialog state
    const [formOpen, setFormOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>();

    // Cancel dialog state
    const [cancelTarget, setCancelTarget] = useState<Project | null>(null);

    const { data, isLoading, isError } = useProjects(filters);

    const { mutate: createProject, isPending: creating, error: createError } = useCreateProject();
    const { mutate: updateProject, isPending: updating, error: updateError } =
        useUpdateProject(editingProject?.id ?? "");
    const { mutate: cancelProject, isPending: cancelling } = useCancelProject(
        cancelTarget?.id ?? ""
    );

    const projects = Array.isArray(data) ? data : [];
    const filtered = searchQuery
        ? projects.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : projects;

    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setFormOpen(true);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setEditingProject(undefined);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFormSubmit = (payload: any) => {
        if (editingProject) {
            updateProject(payload, { onSuccess: handleFormClose });
        } else {
            createProject(payload, { onSuccess: handleFormClose });
        }
    };

    const handleConfirmCancel = () => {
        if (!cancelTarget) return;
        cancelProject(undefined, { onSuccess: () => setCancelTarget(null) });
    };

    const STATUS_OPTIONS = ["", ...Object.values(ProjectStatus)] as const;

    return (
        <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-secondary">{t("title")}</h1>
                {canManage && (
                    <button
                        onClick={() => setFormOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-secondary text-sm font-semibold transition-colors"
                    >
                        <Plus size={16} />
                        {t("newProject")}
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                    <Search
                        size={14}
                        className="absolute start-3 top-1/2 -translate-y-1/2 text-content-muted"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className="w-full rounded-xl border border-gray-200 ps-8 pe-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    />
                </div>
                {canManage && (
                    <select
                        value={filters.status ?? ""}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                status: (e.target.value as ProjectStatus) || undefined,
                            }))
                        }
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                    >
                        <option value="">{t("allStatuses")}</option>
                        {STATUS_OPTIONS.filter(Boolean).map((s) => (
                            <option key={s} value={s}>
                                {t(`status.${s}`)}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Content */}
            {isLoading ? (
                <ProjectListLoader />
            ) : isError ? (
                <p className="text-sm text-status-error">{t("errors.loadFailed")}</p>
            ) : filtered.length === 0 ? (
                <p className="text-sm text-content-muted text-center py-10">{t("noProjects")}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            canManage={canManage}
                            onEdit={handleEdit}
                            onCancel={setCancelTarget}
                        />
                    ))}
                </div>
            )}

            {/* Create / Edit Form */}
            <ProjectForm
                open={formOpen}
                project={editingProject}
                loading={creating || updating}
                error={
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (createError as any)?.message ||
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (updateError as any)?.message ||
                    null
                }
                onSubmit={handleFormSubmit}
                onClose={handleFormClose}
            />

            {/* Cancel Dialog */}
            <CancelProjectDialog
                open={!!cancelTarget}
                projectName={cancelTarget?.name ?? ""}
                loading={cancelling}
                onConfirm={handleConfirmCancel}
                onClose={() => setCancelTarget(null)}
            />
        </div>
    );
}