"use client";

import { useState } from "react";
import { useGeneralSettings, useUpdateGeneralSettings } from "../hooks/useCompany";
import type { UpdateGeneralSettingsRequest } from "../types/company.dto";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button";

const EDIT_ROLES = ["HR"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type SegmentedProps = {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
};

function SegmentedControl({ label, options, value, onChange, disabled }: SegmentedProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-content mb-2">{label}</label>
      <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              value === opt.value
                ? "bg-primary text-secondary"
                : "bg-white text-content hover:bg-gray-50"
            } disabled:cursor-not-allowed`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GeneralSettingsForm() {
  const { data, isLoading } = useGeneralSettings();
  const updateMutation = useUpdateGeneralSettings();
  const { role } = useAuthStore();
  const canEdit = EDIT_ROLES.includes(role);

  const [language, setLanguage] = useState("ar");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [fiscalYearStart, setFiscalYearStart] = useState(1);
  const [initialized, setInitialized] = useState(false);

  if (data && !initialized) {
    setLanguage(data.data.language);
    setDateFormat(data.data.dateFormat);
    setFiscalYearStart(data.data.fiscalYearStart);
    setInitialized(true);
  }

  const handleSave = () => {
    updateMutation.mutate({ language, dateFormat, fiscalYearStart } satisfies UpdateGeneralSettingsRequest);
  };

  if (isLoading) {
    return <div className="text-content-muted p-6">Loading...</div>;
  }

  const fyStart = new Date(2024, fiscalYearStart - 1, 1);
  const fyEnd = new Date(2025, fiscalYearStart - 1, 0);

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-200 bg-card p-6 space-y-6">
        <SegmentedControl
          label="Language"
          options={[
            { value: "ar", label: "Arabic" },
            { value: "en", label: "English" },
          ]}
          value={language}
          onChange={setLanguage}
          disabled={!canEdit}
        />

        <SegmentedControl
          label="Date Format"
          options={[
            { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
            { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
            { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
          ]}
          value={dateFormat}
          onChange={setDateFormat}
          disabled={!canEdit}
        />

        <div>
          <label className="block text-sm font-medium text-content mb-2">Fiscal Year Start</label>
          <select
            value={fiscalYearStart}
            onChange={(e) => setFiscalYearStart(Number(e.target.value))}
            disabled={!canEdit}
            className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {MONTHS.map((name, i) => (
              <option key={i + 1} value={i + 1}>{name}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-content-muted">
            Fiscal year: {fyStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            {" → "}
            {fyEnd.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
