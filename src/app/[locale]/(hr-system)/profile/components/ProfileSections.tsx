"use client";

import { User, Briefcase, Shield, Calendar, Phone, Tag, DollarSign, CheckCircle, Clock, Mail, Hash, MapPin, PhoneCall, MapPinned, Building, Contact, AlertCircle } from "lucide-react";

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
    const hasAddressData = data.country || data.city || data.address;
    const hasEmergencyData = data.emergencyName || data.emergencyPhone || data.emergencyRelation;

    return (
        <div className="bg-card rounded-2xl border border-gray-200 shadow-sm p-4 md:p-5 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <SectionHeading icon={User} label="Personal Info" />
                <SectionGrid>
                    <Field label="Full Name" value={`${data.firstName} ${data.lastName}`} />
                    <Field label="Email" value={data.email} />
                    {data.phone && <Field label="Phone" value={data.phone} />}
                    {data.dateOfBirth && <Field label="Date of Birth" value={formatDate(data.dateOfBirth)!} />}
                    {data.gender && (
                        <Field label="Gender" value={data.gender.charAt(0) + data.gender.slice(1).toLowerCase()} />
                    )}
                </SectionGrid>
            </div>

            <div className="flex flex-col gap-3">
                <SectionHeading icon={Briefcase} label="Job Info" />
                <SectionGrid>
                    {data.jobTitle && <Field label="Job Title" value={data.jobTitle} />}
                    {data.employeeCode && <Field label="Employee Code" value={data.employeeCode} />}
                    {data.hireDate && <Field label="Hire Date" value={formatDate(data.hireDate)!} />}
                    {data.status && (
                        <Field label="Status" value={data.status.charAt(0) + data.status.slice(1).toLowerCase()} />
                    )}
                    {data.departmentId && <Field label="Department ID" value={data.departmentId} />}
                    {data.salary != null && <Field label="Salary" value={`$${data.salary.toLocaleString()}`} />}
                </SectionGrid>
            </div>

            {hasAddressData && (
                <div className="flex flex-col gap-3">
                    <SectionHeading icon={MapPin} label="Address" />
                    <SectionGrid>
                        {data.country && <Field label="Country" value={data.country} />}
                        {data.city && <Field label="City" value={data.city} />}
                        {data.address && <Field label="Address" value={data.address} />}
                    </SectionGrid>
                </div>
            )}

            {hasEmergencyData && (
                <div className="flex flex-col gap-3">
                    <SectionHeading icon={PhoneCall} label="Emergency Contact" />
                    <SectionGrid>
                        {data.emergencyName && <Field label="Contact Name" value={data.emergencyName} />}
                        {data.emergencyPhone && <Field label="Contact Phone" value={data.emergencyPhone} />}
                        {data.emergencyRelation && <Field label="Relation" value={data.emergencyRelation} />}
                    </SectionGrid>
                </div>
            )}

            <div className="flex flex-col gap-3">
                <SectionHeading icon={Shield} label="Account" />
                <SectionGrid>
                    <Field label="Role" value={formatRole(data.role)} />
                    <Field label="Active" value={data.isActive ? "Yes" : "No"} />
                    <Field label="Member Since" value={formatDate(data.createdAt)!} />
                    <Field label="Last Updated" value={formatDate(data.updatedAt)!} />
                </SectionGrid>
            </div>
        </div>
    );
}
