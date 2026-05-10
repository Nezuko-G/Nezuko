"use client";

import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft, Calendar, Clock, User,
    CheckCircle2, Circle, AlertCircle, PauseCircle, XCircle, Pencil,
} from "lucide-react";
import { Project, ProjectStatus } from "../types/project.types";
import { ProjectProgress } from "../_components/ProjectProgress";
import { ProjectTasksSection } from "../_components/ProjectTasksSection";

const MOCK_PROJECTS: Project[] = [
    {
        id: "p1", tenantId: "t1", name: "Mobile App Development",
        description: "Build a cross-platform mobile app for customers.",
        status: "ACTIVE", ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-04-15T00:00:00.000Z", dueDate: "2026-08-15T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p2", tenantId: "t1", name: "E-commerce Platform",
        description: "Scalable e-commerce system with payments.",
        status: "ACTIVE", ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-03-01T00:00:00.000Z", dueDate: "2026-10-01T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p3", tenantId: "t1", name: "Security Audit System",
        description: "Security monitoring dashboard.",
        status: "ACTIVE", ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-04-01T00:00:00.000Z", dueDate: "2026-06-30T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p4", tenantId: "t1", name: "HR Management System",
        description: "Employee tracking and attendance system.",
        status: "PLANNING", ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-05-20T00:00:00.000Z", dueDate: "2026-08-20T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p5", tenantId: "t1", name: "API Gateway Setup",
        description: "Microservices API gateway implementation.",
        status: "COMPLETED", ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-01-01T00:00:00.000Z", dueDate: "2026-03-01T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p6", tenantId: "t1", name: "AI Recommendation Engine",
        description: "ML-based recommendation system.",
        status: "PLANNING", ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-06-01T00:00:00.000Z", dueDate: "2026-12-01T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
];

const STATUS_CONFIG: Record<ProjectStatus, { label: string; icon: React.ReactNode; className: string }> = {
    ACTIVE: { label: "Active", icon: <CheckCircle2 size={13} />, className: "bg-status-success/10 text-status-success border-status-success/30" },
    PLANNING: { label: "Planning", icon: <Circle size={13} />, className: "bg-primary/10 text-primary border-primary/30" },
    ON_HOLD: { label: "On Hold", icon: <PauseCircle size={13} />, className: "bg-status-warning/10 text-status-warning border-status-warning/30" },
    COMPLETED: { label: "Completed", icon: <CheckCircle2 size={13} />, className: "bg-gray-400/10 text-gray-400 border-gray-400/30" },
    CANCELLED: { label: "Cancelled", icon: <XCircle size={13} />, className: "bg-status-error/10 text-status-error border-status-error/30" },
};

function formatDate(iso?: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getDaysLeft(dueDate?: string): number | null {
    if (!dueDate) return null;
    return Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function getTimelineProgress(startDate?: string, dueDate?: string): number {
    if (!startDate || !dueDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(dueDate).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
}

function SectionHeading({ title }: { title: string }) {
    return (
        <h2 className="text-base font-semibold text-[#0f172a] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-primary inline-block" />
            {title}
        </h2>
    );
}

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    // TODO: replace with useProject(id) hook
    const project = MOCK_PROJECTS.find((p) => p.id === id);

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white/40">
                <AlertCircle size={40} className="text-status-error/60" />
                <p className="text-lg font-medium">Project not found</p>
                <button onClick={() => router.back()} className="text-sm text-primary hover:underline">← Go back</button>
            </div>
        );
    }

    const status = STATUS_CONFIG[project.status];
    const progress = getTimelineProgress(project.startDate, project.dueDate);
    const daysLeft = getDaysLeft(project.dueDate);

    const isOverdue = daysLeft !== null && daysLeft < 0;
    const isWarning = daysLeft !== null && daysLeft >= 0 && daysLeft <= 14;

    const daysLeftBg = isOverdue ? "bg-status-error/5 border-status-error/20"
        : isWarning ? "bg-status-warning/5 border-status-warning/20"
            : "bg-white border-gray-100";
    const daysLeftColor = isOverdue ? "text-status-error" : isWarning ? "text-status-warning" : "text-secondary";
    const clockBg = isOverdue ? "bg-status-error/10" : isWarning ? "bg-status-warning/10" : "bg-primary/10";
    const clockColor = isOverdue ? "text-status-error" : isWarning ? "text-status-warning" : "text-primary";

    // TODO: replace with real API responses
    const progressData = {
        totalCount: 2, completedCount: 0, completionPercentage: 0,
        overdueCount: 1, estimatedHours: 20, actualHours: 3, hoursVariance: -17,
    };

    return (
        <div className="min-h-screen px-6 py-5 space-y-5">

            {/* ── Back ── */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-secondary transition-colors group"
            >
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Projects
            </button>

            {/* ════════════════════════════════════
                SECTION 1 — Project Info
            ════════════════════════════════════ */}
            <section>
                <SectionHeading title="Project Info" />
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-2 ${status.className}`}>
                                {status.icon}
                                {status.label}
                            </span>
                            <h1 className="text-xl font-bold text-secondary truncate mb-1">{project.name}</h1>
                            {project.description && (
                                <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
                            )}
                        </div>
                        <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary border border-gray-200 hover:border-primary/40 px-3 py-1.5 rounded-lg transition-all shrink-0">
                            <Pencil size={13} />
                            Edit
                        </button>
                    </div>

                    {/* Owner + Timeline + Days left inline */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">

                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User size={14} className="text-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400">Owner</p>
                                <p className="text-sm font-semibold text-secondary truncate">{project.owner.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Calendar size={14} className="text-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-gray-400">Timeline</p>
                                <p className="text-sm font-semibold text-secondary whitespace-nowrap">
                                    {formatDate(project.startDate)} → {formatDate(project.dueDate)}
                                </p>
                            </div>
                        </div>

                        <div className={`flex items-center gap-2.5 rounded-lg px-3 py-2 border ${daysLeftBg}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${clockBg}`}>
                                <Clock size={14} className={clockColor} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Days Remaining</p>
                                <p className={`text-sm font-bold ${daysLeftColor}`}>
                                    {daysLeft === null ? "No due date"
                                        : daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue`
                                            : `${daysLeft} days left`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════
                SECTION 2 — Timeline Progress
            ════════════════════════════════════ */}
            {(project.startDate || project.dueDate) && (
                <section>
                    <SectionHeading title="Timeline Progress" />
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-sm text-gray-500">Time elapsed</span>
                            <span className="text-sm font-bold text-primary">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                            <span>{formatDate(project.startDate)}</span>
                            <span>{formatDate(project.dueDate)}</span>
                        </div>
                    </div>
                </section>
            )}

            {/* ════════════════════════════════════
                SECTION 3 — Tasks & Hours Overview
            ════════════════════════════════════ */}
            <section>
                <SectionHeading title="Tasks & Hours Overview" />
                <ProjectProgress data={progressData} />
            </section>

            {/* ════════════════════════════════════
                SECTION 4 — Project Tasks
            ════════════════════════════════════ */}
            <section>
                <SectionHeading title="Project Tasks" />
                {/* TODO: pass real tasks from API → replace MOCK_TASKS inside the component */}
                <ProjectTasksSection projectId={id} />
            </section>

            {/* ════════════════════════════════════
                SECTION 5 — Details
            ════════════════════════════════════ */}
            <section>
                <SectionHeading title="Details" />
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 text-sm">
                        {[
                            { label: "Project ID", value: project.id },
                            { label: "Tenant ID", value: project.tenantId },
                            { label: "Created At", value: formatDate(project.createdAt) },
                            { label: "Last Updated", value: formatDate(project.updatedAt) },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between border-b border-gray-50 pb-2">
                                <dt className="text-gray-400">{label}</dt>
                                <dd className="font-medium text-secondary font-mono text-xs">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>

        </div>
    );
}