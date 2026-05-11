"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useProjects } from "../_hooks/useProjects";
import { Project, ProjectStatus, CreateProjectDTO } from "../types/project.types";

interface Props {
    project?: Project;
    onClose: () => void;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string; color: string }[] = [
    { value: "PLANNING", label: "Planning", color: "bg-blue-50 text-blue-500 border-blue-200" },
    { value: "ACTIVE", label: "Active", color: "bg-primary/10 text-primary border-primary/30" },
    { value: "ON_HOLD", label: "On Hold", color: "bg-amber-50 text-amber-500 border-amber-200" },
    { value: "COMPLETED", label: "Completed", color: "bg-gray-100 text-gray-400 border-gray-200" },
];

export function ProjectForm({ project, onClose }: Props) {
    const { createProject, updateProject, loading } = useProjects();
    const isEdit = !!project;

    const [form, setForm] = useState({
        name: project?.name ?? "",
        description: project?.description ?? "",
        startDate: project?.startDate?.slice(0, 10) ?? "",
        dueDate: project?.dueDate?.slice(0, 10) ?? "",
        status: (project?.status ?? "PLANNING") as ProjectStatus,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Project name is required";
        if (form.startDate && form.dueDate && form.dueDate < form.startDate)
            e.dueDate = "Due date must be after start date";
        return e;
    }

    async function handleSubmit() {
        const e = validate();
        if (Object.keys(e).length) return setErrors(e);

        const payload = {
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            startDate: form.startDate || undefined,
            dueDate: form.dueDate || undefined,
            ...(isEdit ? { status: form.status } : {}),
        };

        const success = isEdit
            ? await updateProject(project.id, payload)
            : await createProject(payload);

        if (success) onClose();
    }

    const selectedStatus = STATUS_OPTIONS.find((o) => o.value === form.status)!;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

                {/* Modal header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-900">
                        {isEdit ? "Edit Project" : "New Project"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-5 flex flex-col gap-4">

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">
                            Project Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Website Redesign"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all
                                focus:ring-2 focus:ring-primary/30 focus:border-primary
                                ${errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}
                        />
                        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">Description</label>
                        <textarea
                            rows={3}
                            placeholder="e.g. Redesign the company website with modern UI"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none
                                focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">Status</label>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, status: opt.value })}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                                        ${form.status === opt.value
                                            ? opt.color + " ring-2 ring-offset-1 ring-primary/30"
                                            : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Start Date</label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none
                                    focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-gray-600">Due Date</label>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all
                                    focus:ring-2 focus:ring-primary/30 focus:border-primary
                                    ${errors.dueDate ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                            />
                            {errors.dueDate && <span className="text-xs text-red-500">{errors.dueDate}</span>}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                    {/* Selected status preview */}
                    <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium border ${selectedStatus.color}`}>
                        {selectedStatus.label}
                    </span>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50 transition-colors shadow-sm shadow-primary/20"
                        >
                            {loading ? "Saving..." : isEdit ? "Save changes" : "Create Project"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}