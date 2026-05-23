"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { useSubmitTimesheet } from "@/app/[locale]/(hr-system)/timesheets/hooks/useTimesheets";
import { useEmployeeMapStore } from "@/app/[locale]/(hr-system)/timesheets/store/employee-map.store";
import { SelectWithSearch } from "@/components/ui/select-with-search";

interface EntryForm {
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  notes: string;
}

interface Props {
  onClose: () => void;
}

function calcHours(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  const diff = (outH * 60 + outM) - (inH * 60 + inM);
  return Math.max(0, diff / 60);
}

function EntryRow({
  entry,
  index,
  onChange,
  onRemove,
  errors,
  employees,
}: {
  entry: EntryForm;
  index: number;
  onChange: (i: number, field: keyof EntryForm, value: string) => void;
  onRemove: (i: number) => void;
  errors: Record<string, string>;
  employees: { id: string; firstName: string; lastName: string }[];
}) {
  const t = useTranslations("timesheet.submit");
  const totalHours = calcHours(entry.checkIn, entry.checkOut);

  return (
    <div className="border border-gray-200 rounded-lg p-2 sm:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {t("employee")} #{index + 1}
        </span>
        {index > 0 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <SelectWithSearch
          label={t("employee")}
          placeholder={t("searchPlaceholder")}
          options={employees}
          value={entry.userId}
          onChange={(v) => onChange(index, "userId", v)}
          getOptionValue={(e) => e.id}
          getOptionLabel={(e) => `${e.firstName} ${e.lastName} (${e.id})`}
          searchFields={[(e) => e.firstName, (e) => e.lastName, (e) => `${e.firstName} ${e.lastName}`, (e) => e.id]}
          error={errors[`entry_${index}_userId`]}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">
            {t("date")} <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={entry.date}
            onChange={(e) => onChange(index, "date", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary
              ${errors[`entry_${index}_date`] ? "border-red-300 bg-red-50" : "border-gray-200"}`}
          />
          {errors[`entry_${index}_date`] && (
            <span className="text-xs text-red-500">{errors[`entry_${index}_date`]}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">
            {t("checkIn")} <span className="text-red-400">*</span>
          </label>
          <input
            type="time"
            value={entry.checkIn}
            onChange={(e) => onChange(index, "checkIn", e.target.value)}
            onBlur={(e) => onChange(index, "checkIn", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary
              ${errors[`entry_${index}_checkIn`] ? "border-red-300 bg-red-50" : "border-gray-200"}`}
          />
          {errors[`entry_${index}_checkIn`] && (
            <span className="text-xs text-red-500">{errors[`entry_${index}_checkIn`]}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-600">
            {t("checkOut")} <span className="text-red-400">*</span>
          </label>
          <input
            type="time"
            value={entry.checkOut}
            onChange={(e) => onChange(index, "checkOut", e.target.value)}
            onBlur={(e) => onChange(index, "checkOut", e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary
              ${errors[`entry_${index}_checkOut`] ? "border-red-300 bg-red-50" : "border-gray-200"}`}
          />
          {errors[`entry_${index}_checkOut`] && (
            <span className="text-xs text-red-500">{errors[`entry_${index}_checkOut`]}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">{t("notes")}</label>
        <input
          type="text"
          placeholder={t("notesPlaceholder")}
          value={entry.notes}
          onChange={(e) => onChange(index, "notes", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 border-t border-gray-100 h-4">
        <span>{t("totalHours")}: <strong className="text-gray-700">{totalHours.toFixed(2)}</strong></span>
      </div>
    </div>
  );
}

export function SubmitTimesheetForm({ onClose }: Props) {
  const t = useTranslations("timesheet.submit");
  const submitMutation = useSubmitTimesheet();
  const employees = useEmployeeMapStore((s) => s.employees);
  const [entries, setEntries] = useState<EntryForm[]>([
    { userId: "", date: "", checkIn: "", checkOut: "", notes: "" },
  ]);
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
    setEntries((prev) => [...prev, { userId: "", date: "", checkIn: "", checkOut: "", notes: "" }]);
  }, []);

  function validate(): boolean {
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

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(status: "draft" | "submitted") {
    if (status === "submitted" && !validate()) return;
    setErrors({});

    const payload = {
      status,
      entries: entries.map((e) => ({
        userId: e.userId,
        date: e.date,
        checkIn: `${e.date}T${e.checkIn}:00Z`,
        checkOut: `${e.date}T${e.checkOut}:00Z`,
        ...(e.notes.trim() ? { notes: e.notes.trim() } : {}),
      })),
    };

    try {
      await submitMutation.mutateAsync(payload);
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

        <div className="px-2 sm:px-6  py-5 flex flex-col gap-4 overflow-y-auto">
          {entries.map((entry, i) => (
            <EntryRow
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
            className="flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-primary/50 hover:text-primary transition-all"
          >
            <Plus size={16} />
            {t("addEntry")}
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 px-2 sm:px-6  py-4 border-t border-gray-100 bg-gray-50 shrink-0">
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
