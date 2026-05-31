"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCreateEmployee } from "../hooks/useEmployees";
import { useDepartments } from "@/app/(hr-system)/departments/hooks/useDepartments";
import type { CreateEmployeeRequest } from "../types/employees.dto";

interface Props {
    open: boolean;
    onClose: () => void;
}

const today = new Date().toISOString().split("T")[0];

export default function AddEmployeeModal({ open, onClose }: Props) {
    const t = useTranslations("employees.addModal");
    const { mutateAsync: createEmployee, isPending } = useCreateEmployee();
    const { data: departmentsData } = useDepartments({});
    const departments = departmentsData?.data ?? [];

    const [emailError, setEmailError] = useState("");
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        jobTitle: "",
        departmentId: "",
        hireDate: "",
        gender: "" as "MALE" | "FEMALE" | "",
        dateOfBirth: "",
        phone: "",
    });

    const set = (k: string, v: string) => {
        setForm((f) => ({ ...f, [k]: v }));
        if (k === "email") setEmailError("");
    };

    const resetForm = () => setForm({
        firstName: "",
        lastName: "",
        email: "",
        jobTitle: "",
        departmentId: "",
        hireDate: "",
        gender: "",
        dateOfBirth: "",
        phone: "",
    });

    const handleSubmit = async () => {
        if (!form.email) {
            setEmailError(t("errors.emailRequired"));
            return;
        }
        if (!form.gender) return;
        if (!form.departmentId) return;

        const payload: CreateEmployeeRequest = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            jobTitle: form.jobTitle,
            hireDate: form.hireDate,
            gender: form.gender,
            dateOfBirth: form.dateOfBirth,
            phone: form.phone,
            departmentId: form.departmentId,
        };
        await createEmployee(payload);
        resetForm();
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="font-extrabold text-secondary text-lg">{t("title")}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted transition">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
                    <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 text-primary text-sm">
                        <Info size={16} className="mt-0.5 shrink-0" />
                        <span>{t("passwordBanner")}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label={t("fields.firstName")} value={form.firstName} onChange={(v) => set("firstName", v)} />
                        <Field label={t("fields.lastName")} value={form.lastName} onChange={(v) => set("lastName", v)} />
                    </div>

                    <Field
                        label={t("fields.email")}
                        value={form.email}
                        onChange={(v) => set("email", v)}
                        type="email"
                        error={emailError}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Field label={t("fields.jobTitle")} value={form.jobTitle} onChange={(v) => set("jobTitle", v)} />
                        <Field label={t("fields.phone")} value={form.phone} onChange={(v) => set("phone", v)} type="tel" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <SelectField
                            label={t("fields.department")}
                            value={form.departmentId}
                            onChange={(v) => set("departmentId", v)}
                            options={departments.map((d) => ({ value: d.id, label: d.name }))}
                        />
                        <SelectField
                            label={t("fields.gender")}
                            value={form.gender}
                            onChange={(v) => set("gender", v)}
                            options={[
                                { value: "MALE", label: t("gender.male") },
                                { value: "FEMALE", label: t("gender.female") },
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label={t("fields.hireDate")} value={form.hireDate} onChange={(v) => set("hireDate", v)} type="date" max={today} />
                        <Field label={t("fields.dateOfBirth")} value={form.dateOfBirth} onChange={(v) => set("dateOfBirth", v)} type="date" max={today} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-content-muted hover:bg-gray-100 transition">
                        {t("cancel")}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow hover:opacity-90 transition disabled:opacity-60"
                    >
                        {isPending ? t("saving") : t("save")}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text", error, placeholder, max }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; error?: string; placeholder?: string; max?: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-content-muted">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                max={max}
                className={cn(
                    "px-3 py-2 rounded-xl border bg-background text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/30",
                    error ? "border-status-error" : "border-gray-200"
                )}
            />
            {error && <p className="text-xs text-status-error">{error}</p>}
        </div>
    );
}

function SelectField({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-content-muted">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-background text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
                <option value="" />
                {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );
}