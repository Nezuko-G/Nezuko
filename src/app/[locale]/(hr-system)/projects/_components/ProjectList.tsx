"use client";

import { useEffect, useState } from "react";
import { useProjects } from "../_hooks/useProjects";
import { ProjectForm } from "./ProjectForm";
import { ProjectCard } from "./ProjectCard";
import { Project } from "../types/project.types";
import { Plus } from "lucide-react";

interface Props {
    initialProjects: Project[];
}

type FilterStatus = "ALL" | "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";

const FILTERS: { label: string; value: FilterStatus }[] = [
    { label: "All",       value: "ALL" },
    { label: "Planning",  value: "PLANNING" },
    { label: "Active",    value: "ACTIVE" },
    { label: "On Hold",   value: "ON_HOLD" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
];

const MOCK_PROJECTS: Project[] = [
    {
        id: "p1", tenantId: "t1", name: "Mobile App Development",
        description: "Build a cross-platform mobile app for customers", status: "ACTIVE",
        ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-04-15T00:00:00.000Z", dueDate: "2026-08-15T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p2", tenantId: "t1", name: "E-commerce Platform",
        description: "Scalable e-commerce system with payments", status: "ACTIVE",
        ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-03-01T00:00:00.000Z", dueDate: "2026-10-01T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p3", tenantId: "t1", name: "Security Audit System",
        description: "Security monitoring dashboard", status: "ACTIVE",
        ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-04-01T00:00:00.000Z", dueDate: "2026-06-30T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p4", tenantId: "t1", name: "HR Management System",
        description: "Employee tracking and attendance system", status: "PLANNING",
        ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-05-20T00:00:00.000Z", dueDate: "2026-08-20T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p5", tenantId: "t1", name: "API Gateway Setup",
        description: "Microservices API gateway implementation", status: "COMPLETED",
        ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-01-01T00:00:00.000Z", dueDate: "2026-03-01T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
    {
        id: "p6", tenantId: "t1", name: "AI Recommendation Engine",
        description: "ML-based recommendation system", status: "PLANNING",
        ownerId: "u1", owner: { id: "u1", name: "Omar Khaled" },
        startDate: "2026-06-01T00:00:00.000Z", dueDate: "2026-12-01T00:00:00.000Z",
        createdAt: "2026-05-10T00:00:00.000Z", updatedAt: "2026-05-10T00:00:00.000Z",
    },
];

export function ProjectList({ initialProjects }: Props) {
    const { projects, setProjects, error, clearError } = useProjects();
    const [showForm, setShowForm] = useState(false);
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");

    const allProjects = projects.length > 0 ? projects : MOCK_PROJECTS;
    const displayProjects = activeFilter === "ALL"
        ? allProjects
        : allProjects.filter((p) => p.status === activeFilter);

    useEffect(() => {
        if (initialProjects.length > 0) setProjects(initialProjects);
    }, []);

    return (
        <div className="min-h-screen p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-3xl font-bold tracking-tight text-secondary">Projects</h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-secondary px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus size={16} strokeWidth={2} />
                    New Project
                </button>
            </div>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150
                            ${activeFilter === f.value
                                ? "bg-primary text-secondary border-primary shadow-sm shadow-primary/20"
                                : "bg-white text-gray-500 border-gray-200 hover:border-primary/50 hover:text-primary"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 flex items-center justify-between bg-status-error/10 border border-status-error/30 text-status-error text-sm px-4 py-3 rounded-lg">
                    <span>{error}</span>
                    <button onClick={clearError} className="ml-4 opacity-60 hover:opacity-100 transition-opacity">✕</button>
                </div>
            )}

            {/* Empty state */}
            {displayProjects.length === 0 && (
                <div className="text-center py-20 text-white/30 text-sm">
                    {activeFilter === "ALL" ? (
                        <>No projects yet.{" "}
                            <button onClick={() => setShowForm(true)} className="text-primary hover:underline">Create one</button>
                        </>
                    ) : (
                        <>No {activeFilter.replace("_", " ").toLowerCase()} projects.</>
                    )}
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>

            {showForm && <ProjectForm onClose={() => setShowForm(false)} />}
        </div>
    );
}