"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Loader2 } from "lucide-react";
import type { Timesheet } from "@/app/(hr-system)/timesheets/types/timesheet.dto";
import { combineDateAndTime } from "@/lib/api/utils";

interface Props {
  timesheet: Timesheet;
  onClose: () => void;
  onSave: (data: { checkIn?: string; checkOut?: string; notes?: string }) => Promise<void>;
}

function toTimeInput(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function TimesheetEditDrawer({ timesheet, onClose, onSave }: Props) {
  const t = useTranslations("timesheet.edit");
  const [checkIn, setCheckIn] = useState(toTimeInput(timesheet.checkIn));
  const [checkOut, setCheckOut] = useState(toTimeInput(timesheet.checkOut));
  const [notes, setNotes] = useState(timesheet.notes || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        ...(checkIn && { checkIn: combineDateAndTime(timesheet.date, checkIn) }),
        ...(checkOut && { checkOut: combineDateAndTime(timesheet.date, checkOut) }),
        ...(notes !== (timesheet.notes || "") && { notes }),
      });
    } catch {
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{t("title")}</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
            <p><span className="text-gray-500">{t("employee")}:</span> {timesheet.user ? `${timesheet.user.firstName} ${timesheet.user.lastName}` : timesheet.userId}</p>
            <p><span className="text-gray-500">{t("date")}:</span> {timesheet.date.toLocaleDateString(undefined)}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">{t("checkIn")}</label>
              <input
                type="time"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">{t("checkOut")}</label>
              <input
                type="time"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">{t("notes")}</label>
            <textarea
              rows={2}
              placeholder={t("notesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            disabled={saving}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" />{t("saving")}</>
            ) : (
              t("save")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
