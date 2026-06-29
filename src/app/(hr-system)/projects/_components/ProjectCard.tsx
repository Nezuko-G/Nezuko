"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { CalendarDays, ListTodo } from "lucide-react";
import { ProjectStatusBadge } from "./Badges";
import type { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
  /** Show edit/cancel actions (Manager / HR only) */
  canManage?: boolean;
  onEdit?: (project: Project) => void;
  onCancel?: (project: Project) => void;
}

export function ProjectCard({
  project,
}: ProjectCardProps) {
  const t = useTranslations("projects");

  const fmt = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString(undefined, { dateStyle: "medium" })
      : "—";

  const tasksCount = project._count?.tasks ?? 0;

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

      {/* Dates + Tasks */}
      <div className="flex items-center gap-4 text-xs text-content-muted">
        <span className="flex items-center gap-1">
          <CalendarDays size={12} />
          {fmt(project.startDate)}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays size={12} />
          {fmt(project.dueDate)}
        </span>
        <span className="flex items-center gap-1 text-secondary ms-auto py-1 px-2 bg-primary-light rounded-lg">
          <ListTodo size={12} />
          <span className="font-semibold">{tasksCount}</span>
          {t("detail.tasks")}
        </span>
      </div>
    </div>
  );
}
