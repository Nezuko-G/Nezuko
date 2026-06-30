"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

interface CancelProjectDialogProps {
    projectName: string;
    open: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

export function CancelProjectDialog({
    projectName,
    open,
    loading = false,
    onConfirm,
    onClose,
}: CancelProjectDialogProps) {
    const t = useTranslations("projects.cancelDialog");

    const router =useRouter()

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4 flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon + Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                        <AlertTriangle size={20} className="text-status-error" />
                    </div>
                    <h2 className="text-lg font-bold text-content-dark">{t("title")}</h2>
                </div>

                {/* Description */}
                <p className="text-sm text-content-muted leading-relaxed">
                    <span className="font-semibold text-content-dark">{projectName}</span>
                    {" — "}
                    {t("description")}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-content-muted border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {t("abort")}
                    </button>
                    <button
                        onClick={()=>{  onConfirm();router.back()} }
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-status-error hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        {t("confirm")}
                    </button>
                </div>
            </div>
        </div>
    );
}