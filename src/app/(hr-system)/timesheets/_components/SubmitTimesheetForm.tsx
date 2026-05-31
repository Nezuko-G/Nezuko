"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X, Loader2, Plus } from "lucide-react";
import type { EmployeeOption } from "@/app/(hr-system)/timesheets/store/employee-map.store";
import { useSubmitTimesheet } from "@/app/(hr-system)/timesheets/hooks/useTimesheets";
import { TimesheetEntryRow, type EntryForm } from "./TimesheetEntryRow";
import { combineDateAndTime } from "@/lib/api/utils";

interface Props {
  onClose: () => void;
  employees?: EmployeeOption[];
}

function buildPayload(entries: EntryForm[], status: "draft" | "submitted") {
  return {
    status,
    entries: entries.map((e) => ({
      userId: e.userId,
      date: e.date,
      checkIn: combineDateAndTime(e.date, e.checkIn),
      checkOut: combineDateAndTime(e.date, e.checkOut),
      ...(e.notes.trim() ? { notes: e.notes.trim() } : {}),
    })),
  };
}

function validate(entries: EntryForm[], t: (key: string) => string): Record<string, string> {
  const e: Record<string, string> = {};
  const today = new Date().toISOString().split("T")[0];

  entries.forEach((entry, i) => {
    if (!entry.userId.trim()) e[`entry_${i}_userId`] = t("requiredEmployee");
    if (!entry.date) e[`entry_${i}_date`] = t("requiredDate");
    else if (entry.date > today) e[`entry_${i}_date`] = t("futureDateError");
    if (!entry.checkIn) e[`entry_${i}_checkIn`] = t("requiredCheckIn");
    if (!entry.checkOut) e[`entry_${i}_checkOut`] = t("requiredCheckOut");
    if (entry.checkIn && entry.checkOut && entry.checkIn >= entry.checkOut) {
      e[`entry_${i}_checkOut`] = t("checkOutAfterCheckIn");
    }
  });

  return e;
}

function emptyEntry(): EntryForm {
  return { userId: "", date: "", checkIn: "", checkOut: "", notes: "" };
}

export function SubmitTimesheetForm({ onClose, employees = [] }: Props) {
  const t = useTranslations("timesheet.submit");
  const submitMutation = useSubmitTimesheet();
  const [entries, setEntries] = useState<EntryForm[]>([emptyEntry()]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((index: number, field: keyof EntryForm, value: string) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, [field]: value } : e)));
    if (errors[`entry_${index}_${field}`]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[`entry_${index}_${field}`];
        return next;
      });
    }
  }, [errors]);

  const handleRemove = useCallback((index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addEntry = useCallback(() => {
    setEntries((prev) => [...prev, emptyEntry()]);
  }, []);

  async function handleSubmit(status: "draft" | "submitted") {
    if (status === "submitted") {
      const e = validate(entries, t);
      setErrors(e);
      if (Object.keys(e).length > 0) return;
    }
    setErrors({});

    try {
      await submitMutation.mutateAsync(buildPayload(entries, status));
      onClose();
    } catch {
      // Error handled by mutation onError
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-2 sm:px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-base font-semibold text-gray-900">{t("title")}</h2>
          <button
            onClick={onClose}
            disabled={submitMutation.isPending}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-2 sm:px-6 py-5 flex flex-col gap-4 overflow-y-auto">
          {entries.map((entry, i) => (
            <TimesheetEntryRow
              key={i}
              entry={entry}
              index={i}
              onChange={handleChange}
              onRemove={handleRemove}
              errors={errors}
              employees={employees}
            />
          ))}

          <button
            type="button"
            onClick={addEntry}
            disabled={submitMutation.isPending}
            className="flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary/50 hover:text-primary transition-all disabled:opacity-50"
          >
            <Plus size={16} />
            {t("addEntry")}
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 px-2 sm:px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            onClick={onClose}
            disabled={submitMutation.isPending}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => handleSubmit("draft")}
            disabled={submitMutation.isPending}
            className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            {submitMutation.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : null}
            {t("saveDraft")}
          </button>
          <button
            onClick={() => handleSubmit("submitted")}
            disabled={submitMutation.isPending}
            className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50 transition-colors shadow-sm shadow-primary/20 flex items-center gap-2"
          >
            {submitMutation.isPending ? (
              <><Loader2 size={14} className="animate-spin" />{t("submitting")}</>
            ) : (
              t("submit")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
