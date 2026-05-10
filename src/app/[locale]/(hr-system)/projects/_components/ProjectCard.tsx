"use client";

import { useState } from "react";
import Link from "next/link";
import { Project, ProjectStatus } from "../types/project.types";
import { ProjectForm } from "./ProjectForm";
import { CancelProjectDialog } from "./CancelProjectDialog";
import { CalendarDays } from "lucide-react";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
    PLANNING: { label: "Planning", className: "bg-blue-50   text-blue-500   border border-blue-100" },
    ACTIVE: { label: "Active", className: "bg-primary/10 text-primary    border border-primary/20" },
    ON_HOLD: { label: "On Hold", className: "bg-amber-50  text-amber-500  border border-amber-100" },
    COMPLETED: { label: "Completed", className: "bg-gray-100  text-gray-400   border border-gray-200" },
    CANCELLED: { label: "Cancelled", className: "bg-red-50    text-red-400    border border-red-100" },
};

function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(date?: string) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function ProjectCard({ project }: { project: Project }) {
    const [showEdit, setShowEdit] = useState(false);
    const [showCancel, setShowCancel] = useState(false);

    const { label, className } = statusConfig[project.status];
    const isCancellable = project.status !== "CANCELLED" && project.status !== "COMPLETED";

    return (
        <div className="bg-white border border-gray-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 cursor-pointer group">

            {/* Header */}
            <div className="flex items-start justify-between gap-2">
                <Link
                    href={`/projects/${project.id}`}
                    className="text-sm font-semibold text-secondary group-hover:text-primary transition-colors line-clamp-1"
                >
                    {project.name}
                </Link>
                <span className={`shrink-0 text-[11px] px-2.5 py-0.5 rounded-full font-medium ${className}`}>
                    {label}
                </span>
            </div>

            {/* Description */}
            {project.description && (
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 -mt-1">{project.description}</p>
            )}

            {/* Dates */}
            {(project.startDate || project.dueDate) && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <CalendarDays size={13} className="text-primary shrink-0" />
                    <span>{formatDate(project.startDate)}</span>
                    <span className="text-gray-300">→</span>
                    <span>{formatDate(project.dueDate)}</span>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                {/* Owner */}
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary">
                        {getInitials(project.owner.name)}
                    </div>
                    <span className="text-xs text-gray-500">{project.owner.name}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => { e.preventDefault(); setShowEdit(true); }}
                        className="text-xs font-medium text-gray-400 hover:text-primary transition-colors"
                    >
                        Edit
                    </button>
                    {isCancellable && (
                        <button
                            onClick={(e) => { e.preventDefault(); setShowCancel(true); }}
                            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {showEdit && <ProjectForm project={project} onClose={() => setShowEdit(false)} />}
            {showCancel && <CancelProjectDialog project={project} onClose={() => setShowCancel(false)} />}
        </div>
    );
}