"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";
import { useEmployeeStore } from "../stores/employee.store";
import type { Employee } from "../types/employees.dto";

interface Props {
    employee: Employee | null;
    onClose: () => void;
}

export default function TerminateDialog({ employee, onClose }: Props) {
    const t = useTranslations("employees.terminate");
    const { terminateEmployee } = useEmployeeStore();
    const [isLoading, setIsLoading] = useState(false);

    if (!employee) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        await terminateEmployee(employee.id);
        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-status-error/10 flex items-center justify-center">
                    <AlertTriangle size={28} className="text-status-error" />
                </div>
                <div>
                    <h3 className="font-extrabold text-secondary text-lg mb-1">{t("title")}</h3>
                    <p className="text-content-muted text-sm">
                        {t("description", { name: `${employee.firstName} ${employee.lastName}` })}
                    </p>
                </div>
                <div className="flex gap-3 w-full">
                    <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-content-muted hover:bg-gray-100 transition">
                        {t("cancel")}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 py-2 rounded-xl bg-status-error text-white text-sm font-bold shadow hover:opacity-90 transition disabled:opacity-60"
                    >
                        {isLoading ? t("terminating") : t("confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
}