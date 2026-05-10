"use client";

import { ChevronDown, ChevronRight, AlertTriangle, Clock, User, CheckCircle2, Circle, Loader2, Ban } from "lucide-react";
import { useState } from "react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "CANCELLED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface TaskAssignee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface SubTask {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
    assignee?: TaskAssignee | null;
    estimatedHours?: number | null;
    actualHours?: number | null;
}

interface Task {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
    completedAt?: string | null;
    estimatedHours?: number | null;
    actualHours?: number | null;
    assignee?: TaskAssignee | null;
    createdBy?: TaskAssignee | null;
    project?: { id: string; name: string } | null;
    _count?: { subTasks: number };
    subTasks?: SubTask[];
}

interface Props {
    projectId: string;
    // TODO: pass real tasks from API – replace MOCK_TASKS below
    tasks?: Task[];
}

const MOCK_TASKS: Task[] = [
    {
        id: "f224c9a7", title: "Design Homepage Mockup - Revised",
        description: "Include dark mode variants in the mockup",
        status: "IN_PROGRESS", priority: "URGENT",
        dueDate: "2026-04-01T00:00:00.000Z",
        estimatedHours: 16, actualHours: 3,
        assignee: { id: "u1", firstName: "Omar", lastName: "Khaled", email: "manager@techcorp.com" },
        createdBy: { id: "u1", firstName: "Omar", lastName: "Khaled", email: "manager@techcorp.com" },
        _count: { subTasks: 1 },
        subTasks: [
            {
                id: "9b4a82a4", title: "Create mobile breakpoint designs",
                description: "Design responsive variants for 375px and 768px",
                status: "TODO", priority: "MEDIUM",
                dueDate: "2026-06-10T00:00:00.000Z",
                estimatedHours: 4, actualHours: null,
                assignee: { id: "u1", firstName: "Omar", lastName: "Khaled", email: "manager@techcorp.com" },
            },
        ],
    },
];

const STATUS_CONFIG: Record<TaskStatus, { label: string; icon: React.ReactNode; className: string }> = {
    TODO: { label: "To Do", icon: <Circle size={12} />, className: "bg-gray-100 text-gray-500 border-gray-200" },
    IN_PROGRESS: { label: "In Progress", icon: <Loader2 size={12} />, className: "bg-primary/10 text-primary border-primary/20" },
    IN_REVIEW: { label: "In Review", icon: <Clock size={12} />, className: "bg-status-warning/10 text-status-warning border-status-warning/20" },
    DONE: { label: "Done", icon: <CheckCircle2 size={12} />, className: "bg-status-success/10 text-status-success border-status-success/20" },
    CANCELLED: { label: "Cancelled", icon: <Ban size={12} />, className: "bg-gray-100 text-gray-400 border-gray-200" },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
    LOW: { label: "Low", className: "bg-gray-100 text-gray-400 border-gray-200" },
    MEDIUM: { label: "Medium", className: "bg-blue-50 text-blue-500 border-blue-100" },
    HIGH: { label: "High", className: "bg-status-warning/10 text-status-warning border-status-warning/20" },
    URGENT: { label: "Urgent", className: "bg-status-error/10 text-status-error border-status-error/20" },
};

function formatDate(iso?: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function isOverdue(dueDate?: string | null, completedAt?: string | null): boolean {
    if (!dueDate || completedAt) return false;
    return new Date(dueDate) < new Date();
}

function initials(assignee?: TaskAssignee | null): string {
    if (!assignee) return "?";
    return `${assignee.firstName[0]}${assignee.lastName[0]}`.toUpperCase();
}

function SubTaskRow({ task }: { task: SubTask }) {
    const status = STATUS_CONFIG[task.status];
    const priority = PRIORITY_CONFIG[task.priority];
    const overdue = isOverdue(task.dueDate);

    return (
        <div className="flex items-center gap-3 py-2.5 pl-8 pr-4 border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
            {/* Status */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${status.className}`}>
                {status.icon}
                {status.label}
            </span>

            {/* Title */}
            <span className="flex-1 text-sm text-gray-600 truncate min-w-0">{task.title}</span>

            {/* Priority */}
            <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${priority.className}`}>
                {priority.label}
            </span>

            {/* Due date */}
            <span className={`hidden sm:block text-xs shrink-0 ${overdue ? "text-status-error font-medium" : "text-gray-400"}`}>
                {overdue && <AlertTriangle size={11} className="inline mr-0.5 -mt-0.5" />}
                {formatDate(task.dueDate)}
            </span>

            {/* Assignee avatar */}
            {task.assignee ? (
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-semibold text-primary">
                    {initials(task.assignee)}
                </div>
            ) : (
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <User size={11} className="text-gray-300" />
                </div>
            )}
        </div>
    );
}

function TaskRow({ task }: { task: Task }) {
    const [open, setOpen] = useState(false);
    const hasSubTasks = (task._count?.subTasks ?? 0) > 0;
    const status = STATUS_CONFIG[task.status];
    const priority = PRIORITY_CONFIG[task.priority];
    const overdue = isOverdue(task.dueDate, task.completedAt);

    return (
        <div className="border-b border-gray-50 last:border-0">
            {/* ── Main row ── */}
            <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50/60 transition-colors">

                {/* Expand toggle */}
                <button
                    onClick={() => hasSubTasks && setOpen(!open)}
                    className={`w-5 h-5 flex items-center justify-center shrink-0 rounded transition-colors
                        ${hasSubTasks ? "text-gray-400 hover:text-secondary hover:bg-gray-100" : "text-transparent cursor-default"}`}
                >
                    {hasSubTasks
                        ? open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                        : <span className="w-1.5 h-1.5 rounded-full bg-gray-200 inline-block" />
                    }
                </button>

                {/* Status badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${status.className}`}>
                    {status.icon}
                    {status.label}
                </span>

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary truncate">{task.title}</p>
                    {task.description && (
                        <p className="text-xs text-gray-400 truncate">{task.description}</p>
                    )}
                </div>

                {/* Priority */}
                <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0 ${priority.className}`}>
                    {priority.label}
                </span>

                {/* Hours */}
                {(task.estimatedHours || task.actualHours) && (
                    <span className="hidden md:block text-xs text-gray-400 shrink-0 whitespace-nowrap">
                        {task.actualHours ?? 0}h / {task.estimatedHours ?? 0}h
                    </span>
                )}

                {/* Due date */}
                <span className={`hidden sm:block text-xs shrink-0 whitespace-nowrap ${overdue ? "text-status-error font-medium" : "text-gray-400"}`}>
                    {overdue && <AlertTriangle size={11} className="inline mr-0.5 -mt-0.5" />}
                    {formatDate(task.dueDate)}
                </span>

                {/* Assignee avatar */}
                {task.assignee ? (
                    <div
                        className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-semibold text-primary"
                        title={`${task.assignee.firstName} ${task.assignee.lastName}`}
                    >
                        {initials(task.assignee)}
                    </div>
                ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <User size={13} className="text-gray-300" />
                    </div>
                )}
            </div>

            {/* ── Sub-tasks ── */}
            {open && task.subTasks?.map((sub) => (
                <SubTaskRow key={sub.id} task={sub} />
            ))}
        </div>
    );
}

export function ProjectTasksSection({ projectId, tasks }: Props) {
    // use passed tasks or fall back to mock
    const taskList = tasks ?? MOCK_TASKS;

    if (taskList.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <CheckCircle2 size={32} className="mx-auto text-gray-200 mb-2" />
                <p className="text-sm text-gray-400">No tasks yet for this project.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Table header */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-400">
                <span className="w-5 shrink-0" />
                <span className="w-24 shrink-0">Status</span>
                <span className="flex-1">Task</span>
                <span className="hidden sm:block w-16 shrink-0">Priority</span>
                <span className="hidden md:block w-16 shrink-0">Hours</span>
                <span className="hidden sm:block w-20 shrink-0">Due date</span>
                <span className="w-7 shrink-0">Who</span>
            </div>

            {/* Rows */}
            {taskList.map((task) => (
                <TaskRow key={task.id} task={task} />
            ))}

            {/* Footer count */}
            <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
                <p className="text-xs text-gray-400">{taskList.length} task{taskList.length !== 1 ? "s" : ""}</p>
            </div>
        </div>
    );
}