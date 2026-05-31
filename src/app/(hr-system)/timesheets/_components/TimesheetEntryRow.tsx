"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { SelectWithSearch } from "@/components/ui/select-with-search";

export interface EntryForm {
  userId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  notes: string;
}

export function calcHours(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const [inH, inM] = checkIn.split(":").map(Number);
  const [outH, outM] = checkOut.split(":").map(Number);
  const diff = (outH * 60 + outM) - (inH * 60 + inM);
  return Math.max(0, diff / 60);
}

interface Props {
  entry: EntryForm;
  index: number;
  onChange: (i: number, field: keyof EntryForm, value: string) => void;
  onRemove: (i: number) => void;
  errors: Record<string, string>;
  employees: { id: string; firstName: string; lastName: string }[];
}

export function TimesheetEntryRow({
  entry,
  index,
  onChange,
  onRemove,
  errors,
  employees,
}: Props) {
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
