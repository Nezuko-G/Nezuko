"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { CalendarDays, AlertTriangle } from "lucide-react";
import { ProjectStatusBadge } from "./Badges";
import type { Project } from "../types/project.types";

interface ProjectCardProps {
    project: Project;
    completionPct?: number;
    overdueCount?: number;
    /** Show edit/cancel actions (Manager / HR only) */
    canManage?: boolean;
    onEdit?: (project: Project) => void;
    onCancel?: (project: Project) => void;
}

export function ProjectCard({
    project,
    completionPct = 0,
    overdueCount = 0,
    canManage = false,
    onEdit,
    onCancel,
}: ProjectCardProps) {
    const t = useTranslations("projects");

    const fmt = (d?: string) =>
        d ? new Date(d).toLocaleDateString(undefined, { dateStyle: "medium" }) : "—";

    return (
        <div className="group rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <Link
                    href={`/projects/${project.id}`}
                    className="text-base font-semibold text-secondary hover:text-primary transition-colors line-clamp-1"
                >
                    {project.name}
                </Link>
                <ProjectStatusBadge status={project.status} />
            </div>

            {/* Description */}
            {project.description && (
                <p className="text-sm text-content-muted line-clamp-2">
                    {project.description}
                </p>
            )}

            {/* Dates */}
            <div className="flex items-center gap-4 text-xs text-content-muted">
                <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    {fmt(project.startDate)}
                </span>
                <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    {fmt(project.dueDate)}
                </span>
            </div>

            {/* Progress bar */}
            <div>
                <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-content-muted">{t("detail.progress")}</span>
                    <span className="font-semibold text-secondary">{completionPct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${completionPct}%` }}
                    />
                </div>
            </div>

            {/* Overdue warning */}
            {overdueCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-status-error">
                    <AlertTriangle size={12} />
                    {overdueCount} {t("detail.overdueCount")}
                </div>
            )}

            {/* Manager actions */}
            {canManage && (
                <div className="flex items-center gap-2 pt-1 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit?.(project)}
                        className="text-xs text-primary font-medium hover:underline"
                    >
                        {t("actions.edit")}
                    </button>
                    <span className="text-gray-200">|</span>
                    <button
                        onClick={() => onCancel?.(project)}
                        className="text-xs text-status-error font-medium hover:underline"
                    >
                        {t("actions.cancel")}
                    </button>
                </div>
            )}
        </div>
    );
}