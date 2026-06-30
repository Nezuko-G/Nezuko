/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import api from "@/lib/axios/core/instance";
import type { Project, CreateProjectPayload, UpdateProjectPayload } from "../types/project.types";
import { ProjectStatus } from "../types/project.types";

interface Option {
    id: string;
    name: string;
}

interface ProjectFormProps {
    open: boolean;
    project?: Project; 
    loading?: boolean;
    error?: string | null;
    onSubmit: (data: CreateProjectPayload | UpdateProjectPayload) => void;
    onClose: () => void;
}

const EMPTY: CreateProjectPayload = {
    name: "",
    description: "",
    status: ProjectStatus.PLANNING,
    startDate: "",
    dueDate: "",
};

export function ProjectForm({
    open,
    project,
    loading = false,
    error,
    onSubmit,
    onClose,
}: ProjectFormProps) {
    const t = useTranslations("projects");
    const [form, setForm] = useState<CreateProjectPayload>(EMPTY);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [employees, setEmployees] = useState<Option[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    useEffect(() => {
        if (project) {
            setForm({
                name: project.name,
                description: project.description ?? "",
                status: project.status,
                ownerId: project.ownerId ?? "",
                startDate: project.startDate?.slice(0, 10) ?? "",
                dueDate: project.dueDate?.slice(0, 10) ?? "",
            });
        } else {
            setForm(EMPTY);
        }
        setValidationError(null);
    }, [project, open]);

    useEffect(() => {
        if (!open) return;
        setLoadingEmployees(true);
        api.get("/employee")
            .then((res) => {
                const data = res.data?.data ?? res.data;
                const list: Option[] = (Array.isArray(data) ? data : Array.isArray(data?.employees) ? data.employees : [])
                    .map((e: Record<string, unknown>) => ({
                        id: e.id as string,
                        name: (e.name ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`).toString().trim() || "Unknown",
                    }));
                setEmployees(list);
            })
            .catch(() => setEmployees([]))
            .finally(() => setLoadingEmployees(false));
    }, [open]);

    if (!open) return null;

    const handleSubmit = () => {
        if (!form.name.trim()) {
            setValidationError(t("form.nameRequired"));
            return;
        }
        if (!isEdit && !form.ownerId) {
            setValidationError(t("form.ownerRequired"));
            return;
        }
        if (form.startDate && form.dueDate && form.dueDate < form.startDate) {
            setValidationError(t("form.dueDateAfterStart"));
            return;
        }
        setValidationError(null);
        onSubmit(form);
    };

    const isEdit = !!project;
    const title = isEdit ? t("form.editTitle") : t("form.createTitle");

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4 flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-content-dark">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={16} className="text-content-muted" />
                    </button>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-3">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-content mb-1">
                            {t("fields.name")} *
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder={t("form.namePlaceholder")}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-content mb-1">
                            {t("fields.description")}
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, description: e.target.value }))
                            }
                            placeholder={t("form.descriptionPlaceholder")}
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                        />
                    </div>

                    {/* Owner (create only) */}
                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-content mb-1">
                                {t("fields.owner")} *
                            </label>
                            <select
                                value={form.ownerId ?? ""}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, ownerId: e.target.value || undefined }))
                                }
                                disabled={loadingEmployees}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">{loadingEmployees ? t("tasks.loading") : "—"}</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-content mb-1">
                            {t("fields.status")}
                        </label>
                        <select
                            value={form.status}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    status: e.target.value as ProjectStatus,
                                }))
                            }
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                        >
                            {Object.values(ProjectStatus).map((s) => (
                                <option key={s} value={s}>
                                    {t(`status.${s}`)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-content mb-1">
                                {t("form.startDateLabel")}
                            </label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, startDate: e.target.value }))
                                }
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-content mb-1">
                                {t("form.dueDateLabel")}
                            </label>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, dueDate: e.target.value }))
                                }
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Errors */}
                {(validationError || error) && (
                    <p className="text-sm text-status-error bg-red-50 rounded-lg px-3 py-2">
                        {validationError || error}
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-content-muted border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {t("actions.discard")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-secondary bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        {isEdit ? t("actions.save") : t("actions.create")}
                    </button>
                </div>
            </div>
        </div>
    );
}