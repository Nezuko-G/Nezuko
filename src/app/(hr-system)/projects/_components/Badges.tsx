"use client";

import { useTranslations } from "next-intl";
import { ProjectStatus, TaskStatus, TaskPriority } from "../types/project.types";


const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
    [ProjectStatus.PLANNING]: "bg-blue-50 text-blue-600",
    [ProjectStatus.ACTIVE]: "bg-emerald-50 text-emerald-600",
    [ProjectStatus.ON_HOLD]: "bg-amber-50 text-amber-600",
    [ProjectStatus.COMPLETED]: "bg-gray-100 text-gray-600",
    [ProjectStatus.CANCELLED]: "bg-red-50 text-red-500",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
    const t = useTranslations("projects.status");
    const safe = status ?? ProjectStatus.PLANNING;
    const style = PROJECT_STATUS_STYLES[safe] ?? "bg-gray-100 text-gray-500";

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>
            {t(safe)}
        </span>
    );
}

const TASK_STATUS_STYLES: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: "bg-gray-100 text-gray-500",
    [TaskStatus.IN_PROGRESS]: "bg-blue-50 text-blue-600",
    [TaskStatus.IN_REVIEW]: "bg-purple-50 text-purple-600",
    [TaskStatus.DONE]: "bg-emerald-50 text-emerald-600",
    [TaskStatus.BLOCKED]: "bg-red-50 text-red-500",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
    const t = useTranslations("projects.tasks.status");
    const safe = status ?? TaskStatus.TODO;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${TASK_STATUS_STYLES[safe]}`}
        >
            {t(safe)}
        </span>
    );
}


const PRIORITY_STYLES: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: "bg-gray-50 text-gray-400",
    [TaskPriority.MEDIUM]: "bg-yellow-50 text-yellow-600",
    [TaskPriority.HIGH]: "bg-orange-50 text-orange-600",
    [TaskPriority.URGENT]: "bg-red-50 text-red-600 font-bold",
};

const PRIORITY_DOTS: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: "bg-gray-300",
    [TaskPriority.MEDIUM]: "bg-yellow-400",
    [TaskPriority.HIGH]: "bg-orange-500",
    [TaskPriority.URGENT]: "bg-red-500",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
    const t = useTranslations("projects.tasks.priority");
    const safe = priority ?? TaskPriority.MEDIUM;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${PRIORITY_STYLES[safe]}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOTS[safe]}`} />
            {t(safe)}
        </span>
    );
}