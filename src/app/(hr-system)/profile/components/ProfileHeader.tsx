"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Mail, Phone, Calendar, Hash, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    data: {
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        isActive: boolean;
        employeeCode?: string | null;
        jobTitle?: string | null;
        phone?: string | null;
        hireDate?: string | null;
    };
}

function formatRole(role: string) {
    return role
        .split("_")
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(" ");
}

function formatDate(dateStr?: string | null) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const FIELD_ICONS = {
    code: Hash,
    phone: Phone,
    hireDate: Calendar,
} as const;

export default function ProfileHeader({ data }: Props) {
    
    const router = useRouter();
    function handleLogout(router: ReturnType<typeof useRouter>) {
        localStorage.removeItem("auth");
        router.push("/login");
    }
    const t = useTranslations("profile");
    const initials = `${data.firstName[0]}${data.lastName[0]}`;

    const sidebarFields = [
        { key: "code", label: t("fields.code"), value: data.employeeCode, icon: FIELD_ICONS.code },
        { key: "phone", label: t("fields.phone"), value: data.phone, icon: FIELD_ICONS.phone },
        { key: "hireDate", label: t("fields.hireDate"), value: formatDate(data.hireDate), icon: FIELD_ICONS.hireDate },
    ].filter((f) => f.value);

    return (
        <div className="w-full lg:w-64 shrink-0 bg-card rounded-2xl border border-gray-200 shadow-sm overflow-hidden self-start">
            <div className="h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

            <div className="px-6 pt-6 pb-5 flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-extrabold text-2xl ring-4 ring-white shadow-sm">
                    {initials}
                </div>

                <div className="text-center">
                    <h2 className="font-bold text-secondary text-lg">{data.firstName} {data.lastName}</h2>
                    {data.jobTitle && <p className="text-content-muted text-sm font-medium">{data.jobTitle}</p>}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-content-muted">
                    <Mail size={12} className="text-primary" />
                    <span>{data.email}</span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {formatRole(data.role)}
                    </span>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold",
                        data.isActive
                            ? "bg-status-success/10 text-status-success"
                            : "bg-status-error/10 text-status-error"
                    )}>
                        {data.isActive ? t("active") : t("inactive")}
                    </span>
                </div>
            </div>

            {sidebarFields.length > 0 && (
                <div className="px-6 pb-5 flex flex-col gap-2.5 border-t border-gray-100 pt-4">
                    {sidebarFields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.key} className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                                    <Icon size={13} className="text-primary/60" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-content-muted/60">
                                        {field.label}
                                    </span>
                                    <span className="text-xs font-bold text-secondary truncate">
                                        {field.value}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                <button
                    onClick={() => handleLogout(router)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-semibold"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </div>
    );
}
