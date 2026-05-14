"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateEmployee } from "../../hooks/useEmployees";
import type { EmployeeSummary, UpdateEmployeeRequest } from "../../types/employees.dto";

type Section = "personal" | "job" | "address" | "emergency";
const SECTIONS: Section[] = ["personal", "job", "address", "emergency"];

interface Props {
    employee: EmployeeSummary;
    readOnly?: boolean;
}

export default function ProfileSections({ employee, readOnly }: Props) {
    const t = useTranslations("employees.profile");
    const { mutateAsync: updateEmployee, isPending: isSaving } = useUpdateEmployee(employee.id);
    const [activeSection, setActiveSection] = useState<Section>("personal");

    const [form, setForm] = useState<UpdateEmployeeRequest>({
        firstName: employee.firstName,
        lastName: employee.lastName,
        jobTitle: employee.jobTitle ?? "",
        phone: employee.phone ?? "",
        gender: employee.gender ?? undefined,
        hireDate: employee.hireDate ? employee.hireDate.split("T")[0] : undefined,
        country: "",
        city: "",
        address: "",
        emergencyName: "",
        emergencyPhone: "",
        emergencyRelation: "",
    });

    const set = (key: keyof UpdateEmployeeRequest, value: string) =>
        setForm((f) => ({ ...f, [key]: value }));

    const handleSave = async () => {
        const payload = Object.fromEntries(
            Object.entries(form).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
        ) as UpdateEmployeeRequest;

        console.log("PAYLOAD:", JSON.stringify(payload, null, 2));
        await updateEmployee(payload);
    };
    if (!employee) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1 flex-wrap border-b border-gray-100 pb-1">
                {SECTIONS.map((s) => (
                    <button
                        key={s}
                        onClick={() => setActiveSection(s)}
                        className={cn(
                            "px-4 py-2 rounded-t-lg text-sm font-semibold transition",
                            activeSection === s
                                ? "bg-primary text-white"
                                : "text-content-muted hover:text-secondary hover:bg-gray-100"
                        )}
                    >
                        {t(`sections.${s}`)}
                    </button>
                ))}
            </div>

            <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
                {activeSection === "personal" && (
                    <SectionGrid>
                        <Field label={t("fields.firstName")} value={form.firstName ?? ""} onChange={(v) => set("firstName", v)} readOnly={readOnly} />
                        <Field label={t("fields.lastName")} value={form.lastName ?? ""} onChange={(v) => set("lastName", v)} readOnly={readOnly} />
                        <Field label={t("fields.email")} value={employee.email} readOnly />
                        <Field label={t("fields.phone")} value={form.phone ?? ""} onChange={(v) => set("phone", v)} readOnly={readOnly} />
                        <Field label={t("fields.gender")} value={form.gender ?? ""} onChange={(v) => set("gender", v)} readOnly={readOnly} />
                    </SectionGrid>
                )}

                {activeSection === "job" && (
                    <SectionGrid>
                        <Field label={t("fields.jobTitle")} value={form.jobTitle ?? ""} onChange={(v) => set("jobTitle", v)} readOnly={readOnly} />
                        <Field label={t("fields.department")} value={employee.department?.name ?? "—"} readOnly />
                        <Field label={t("fields.employeeCode")} value={employee.employeeCode ?? "—"} readOnly />
                        <Field label={t("fields.hireDate")} value={form.hireDate ?? ""} onChange={(v) => set("hireDate", v)} type="date" readOnly={readOnly} />
                        <Field label={t("fields.status")} value={employee.status} readOnly />
                    </SectionGrid>
                )}

                {activeSection === "address" && (
                    <SectionGrid>
                        <Field label={t("fields.street")} value={form.address ?? ""} onChange={(v) => set("address", v)} readOnly={readOnly} />
                        <Field label={t("fields.city")} value={form.city ?? ""} onChange={(v) => set("city", v)} readOnly={readOnly} />
                        <Field label={t("fields.country")} value={form.country ?? ""} onChange={(v) => set("country", v)} readOnly={readOnly} />
                    </SectionGrid>
                )}

                {activeSection === "emergency" && (
                    <SectionGrid>
                        <Field label={t("fields.contactName")} value={form.emergencyName ?? ""} onChange={(v) => set("emergencyName", v)} readOnly={readOnly} />
                        <Field label={t("fields.relationship")} value={form.emergencyRelation ?? ""} onChange={(v) => set("emergencyRelation", v)} readOnly={readOnly} />
                        <Field label={t("fields.contactPhone")} value={form.emergencyPhone ?? ""} onChange={(v) => set("emergencyPhone", v)} readOnly={readOnly} />
                    </SectionGrid>
                )}

                {!readOnly && (
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold shadow hover:opacity-90 transition disabled:opacity-60"
                        >
                            <Save size={14} />
                            {isSaving ? t("saving") : t("save")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function SectionGrid({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field({ label, value, onChange, type = "text", readOnly }: {
    label: string;
    value: string;
    onChange?: (v: string) => void;
    type?: string;
    readOnly?: boolean;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-content-muted">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                readOnly={readOnly}
                className={cn(
                    "px-3 py-2 rounded-xl border text-content text-sm focus:outline-none",
                    readOnly
                        ? "bg-gray-50 border-gray-100 text-content-muted cursor-default"
                        : "bg-background border-gray-200 focus:ring-2 focus:ring-primary/30"
                )}
            />
        </div>
    );
}