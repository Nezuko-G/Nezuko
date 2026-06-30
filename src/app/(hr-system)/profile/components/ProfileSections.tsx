"use client";

import { useTranslations } from "next-intl";
import { User, Briefcase, Shield,  MapPin, PhoneCall } from "lucide-react";

interface Props {
    data: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string | null;
        dateOfBirth?: string | null;
        gender?: string | null;
        jobTitle?: string | null;
        employeeCode?: string | null;
        hireDate?: string | null;
        status?: string | null;
        salary?: number | null;
        departmentId?: string | null;
        country?: string | null;
        city?: string | null;
        address?: string | null;
        emergencyName?: string | null;
        emergencyPhone?: string | null;
        emergencyRelation?: string | null;
        role: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

function formatDate(dateStr?: string | null) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatRole(role: string) {
    return role
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
}

function SectionHeading({ icon: Icon, label }: { icon: typeof User; label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon size={14} className="text-primary" />
            </div>
            <span className="text-xs uppercase tracking-widest font-bold text-content">{label}</span>
            <div className="flex-1 border-t border-gray-200" />
        </div>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-card rounded-xl border border-gray-200 shadow-sm px-4 py-3.5 flex flex-col gap-1 hover:shadow-md transition-shadow">
            <span className="text-[11px] uppercase tracking-wider font-bold text-content-muted/60">{label}</span>
            <span className="text-sm font-semibold text-secondary">{value}</span>
        </div>
    );
}

function SectionGrid({ children }: { children: React.ReactNode }) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}

export default function ProfileSections({ data }: Props) {
    const t = useTranslations("profile");
    const hasAddressData = data.country || data.city || data.address;
    const hasEmergencyData = data.emergencyName || data.emergencyPhone || data.emergencyRelation;

    return (
        <div className="bg-card rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <SectionHeading icon={User} label={t("sections.personal")} />
                <SectionGrid>
                    <Field label={t("fields.fullName")} value={`${data.firstName} ${data.lastName}`} />
                    <Field label={t("fields.email")} value={data.email} />
                    {data.phone && <Field label={t("fields.phone")} value={data.phone} />}
                    {data.dateOfBirth && <Field label={t("fields.dateOfBirth")} value={formatDate(data.dateOfBirth)!} />}
                    {data.gender && (
                        <Field label={t("fields.gender")} value={data.gender.charAt(0) + data.gender.slice(1).toLowerCase()} />
                    )}
                </SectionGrid>
            </div>

            <div className="flex flex-col gap-3">
                <SectionHeading icon={Briefcase} label={t("sections.job")} />
                <SectionGrid>
                    {data.jobTitle && <Field label={t("fields.jobTitle")} value={data.jobTitle} />}
                    {data.employeeCode && <Field label={t("fields.employeeCode")} value={data.employeeCode} />}
                    {data.hireDate && <Field label={t("fields.hireDate")} value={formatDate(data.hireDate)!} />}
                    {data.status && (
                        <Field label={t("fields.status")} value={data.status.charAt(0) + data.status.slice(1).toLowerCase()} />
                    )}
                    {data.departmentId && <Field label={t("fields.departmentId")} value={data.departmentId} />}
                    {data.salary != null && <Field label={t("fields.salary")} value={`$${data.salary.toLocaleString()}`} />}
                </SectionGrid>
            </div>

            {hasAddressData && (
                <div className="flex flex-col gap-3">
                    <SectionHeading icon={MapPin} label={t("sections.address")} />
                    <SectionGrid>
                        {data.country && <Field label={t("fields.country")} value={data.country} />}
                        {data.city && <Field label={t("fields.city")} value={data.city} />}
                        {data.address && <Field label={t("fields.address")} value={data.address} />}
                    </SectionGrid>
                </div>
            )}

            {hasEmergencyData && (
                <div className="flex flex-col gap-3">
                    <SectionHeading icon={PhoneCall} label={t("sections.emergency")} />
                    <SectionGrid>
                        {data.emergencyName && <Field label={t("fields.contactName")} value={data.emergencyName} />}
                        {data.emergencyPhone && <Field label={t("fields.contactPhone")} value={data.emergencyPhone} />}
                        {data.emergencyRelation && <Field label={t("fields.relation")} value={data.emergencyRelation} />}
                    </SectionGrid>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <SectionHeading icon={Shield} label={t("sections.account")} />
                <SectionGrid>
                    <Field label={t("fields.role")} value={formatRole(data.role)} />
                    <Field label={t("fields.active")} value={data.isActive ? t("fields.yes") : t("fields.no")} />
                    <Field label={t("fields.memberSince")} value={formatDate(data.createdAt)!} />
                    <Field label={t("fields.lastUpdated")} value={formatDate(data.updatedAt)!} />
                </SectionGrid>
            </div>
        </div>
    );
}
