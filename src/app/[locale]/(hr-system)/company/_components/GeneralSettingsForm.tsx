"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGeneralSettings, useUpdateGeneralSettings } from "../hooks/useCompany";
import type { UpdateGeneralSettingsRequest } from "../types/company.dto";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button";

const EDIT_ROLES = ["HR"];

type SegmentedProps<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  disabled: boolean;
};

function SegmentedControl<T extends string>({ label, options, value, onChange, disabled }: SegmentedProps<T>) {
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
  const t = useTranslations("company.generalSettings");
  const { data, isLoading } = useGeneralSettings();
  const updateMutation = useUpdateGeneralSettings();
  const { role } = useAuthStore();
  const canEdit = EDIT_ROLES.includes(role);

  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [dateFormat, setDateFormat] = useState<"DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD">("DD/MM/YYYY");
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
    return <div className="text-content-muted p-6">{t("states.loading")}</div>;
  }

  const fyStart = new Date(2024, fiscalYearStart - 1, 1);
  const fyEnd = new Date(2025, fiscalYearStart - 1, 0);
  const fyStartLabel = fyStart.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const fyEndLabel = fyEnd.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-200 bg-card p-6 space-y-6">
        <h3 className="text-base font-semibold text-content-dark">{t("sectionTitle")}</h3>

        <SegmentedControl
          label={t("fields.language")}
          options={[
            { value: "ar", label: t("languages.ar") },
            { value: "en", label: t("languages.en") },
          ]}
          value={language}
          onChange={setLanguage}
          disabled={!canEdit}
        />

        <SegmentedControl
          label={t("fields.dateFormat")}
          options={[
            { value: "DD/MM/YYYY", label: t("dateFormats.DD/MM/YYYY") },
            { value: "MM/DD/YYYY", label: t("dateFormats.MM/DD/YYYY") },
            { value: "YYYY-MM-DD", label: t("dateFormats.YYYY-MM-DD") },
          ]}
          value={dateFormat}
          onChange={setDateFormat}
          disabled={!canEdit}
        />

        <div>
          <label className="block text-sm font-medium text-content mb-2">{t("fields.fiscalYearStart")}</label>
          <select
            value={fiscalYearStart}
            onChange={(e) => setFiscalYearStart(Number(e.target.value))}
            disabled={!canEdit}
            className="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{t(`months.${n}`)}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-content-muted">
            {t("fiscalYearHint", { start: fyStartLabel, end: fyEndLabel })}
          </p>
        </div>
      </div>

      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? t("buttons.saving") : t("buttons.save")}
          </Button>
        </div>
      )}
    </div>
  );
}
