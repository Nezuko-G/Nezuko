"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Loader2 } from "lucide-react";
import type { Timesheet } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";
import { useReviewTimesheet } from "@/app/[locale]/(hr-system)/timesheets/hooks/useTimesheets";

interface Props {
  timesheet: Timesheet;
  onClose: () => void;
}

export function ApproveRejectModal({ timesheet, onClose }: Props) {
  const t = useTranslations("timesheet.review");
  const tt = useTranslations("timesheet.table");
  const reviewMutation = useReviewTimesheet();
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reviewNote, setReviewNote] = useState("");

  async function handleSubmit() {
    try {
      await reviewMutation.mutateAsync({ id: timesheet.id, data: { status }});
      onClose();
    } catch {
      // Error handled by mutation's onError
    }
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatTime(date: Date | null) {
    if (!date) return "—";
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{t("title")}</h2>
          <button
            onClick={onClose}
            disabled={reviewMutation.isPending}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
            <p><span className="text-gray-500">{tt("employee")}:</span> <span className="font-medium">
              {timesheet.user ? `${timesheet.user.firstName} ${timesheet.user.lastName}` : timesheet.userId}
            </span></p>
            <p><span className="text-gray-500">{tt("date")}:</span> <span className="font-medium">{formatDate(timesheet.date)}</span></p>
            <p><span className="text-gray-500">{tt("checkIn")}:</span> {formatTime(timesheet.checkIn)}</p>
            <p><span className="text-gray-500">{tt("checkOut")}:</span> {formatTime(timesheet.checkOut)}</p>
            <p><span className="text-gray-500">{tt("totalHours")}:</span> {timesheet.totalHours.toFixed(2)}</p>
            {timesheet.notes && <p><span className="text-gray-500">{tt("notes")}:</span> {timesheet.notes}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">{t("decision")}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus("APPROVED")}
                disabled={reviewMutation.isPending}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${
                  status === "APPROVED"
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {t("approve")}
              </button>
              <button
                onClick={() => setStatus("REJECTED")}
                disabled={reviewMutation.isPending}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${
                  status === "REJECTED"
                    ? "bg-red-50 text-red-500 border-red-200"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {t("reject")}
              </button>
            </div>
          </div>

          {/* <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">{t("note")}</label>
            <textarea
              rows={2}
              placeholder={t("notePlaceholder")}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              disabled={reviewMutation.isPending}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50"
            />
          </div> */}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={reviewMutation.isPending}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={reviewMutation.isPending}
            className={`text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2 ${
              status === "APPROVED"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {reviewMutation.isPending ? (
              <><Loader2 size={14} className="animate-spin" />{t("processing")}</>
            ) : (
              status === "APPROVED" ? t("approve") : t("reject")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
