"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Loader2 } from "lucide-react";
import { useCreateLeaveRequest } from "@/app/[locale]/(hr-system)/leave/hooks/useLeaveRequests";

interface Props {
  onClose: () => void;
}

export function LeaveRequestForm({ onClose }: Props) {
  const t = useTranslations("leave");
  const createLeaveRequest = useCreateLeaveRequest();

  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.startDate) e.startDate = t("validation.startDateRequired");
    if (!form.endDate) e.endDate = t("validation.endDateRequired");
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = t("validation.endDateAfter");
    if (!form.reason.trim()) e.reason = t("validation.reasonRequired");
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    try {
      await createLeaveRequest.mutateAsync({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        reason: form.reason.trim(),
      });
      onClose();
    } catch {
      // Error is handled by useCreateLeaveRequest's onError
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{t("createTitle")}</h2>
          <button
            onClick={onClose}
            disabled={createLeaveRequest.isPending}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("startDate")} <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => {
                  setForm({ ...form, startDate: e.target.value });
                  if (errors.startDate) setErrors({ ...errors, startDate: "" });
                }}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary
                  ${errors.startDate ? "border-red-300 bg-red-50" : "border-gray-200"}`}
              />
              {errors.startDate && <span className="text-xs text-red-500">{errors.startDate}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">
                {t("endDate")} <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => {
                  setForm({ ...form, endDate: e.target.value });
                  if (errors.endDate) setErrors({ ...errors, endDate: "" });
                }}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary
                  ${errors.endDate ? "border-red-300 bg-red-50" : "border-gray-200"}`}
              />
              {errors.endDate && <span className="text-xs text-red-500">{errors.endDate}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">
              {t("reason")} <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder={t("reasonPlaceholder")}
              value={form.reason}
              onChange={(e) => {
                setForm({ ...form, reason: e.target.value });
                if (errors.reason) setErrors({ ...errors, reason: "" });
              }}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none resize-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary
                ${errors.reason ? "border-red-300 bg-red-50" : "border-gray-200"}`}
            />
            {errors.reason && <span className="text-xs text-red-500">{errors.reason}</span>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={createLeaveRequest.isPending}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={createLeaveRequest.isPending}
            className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
          >
            {createLeaveRequest.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}