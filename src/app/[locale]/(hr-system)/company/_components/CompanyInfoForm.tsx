"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCompanyInfo, useUpdateCompanyInfo, useUploadLogo, useDeleteLogo } from "../hooks/useCompany";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button";
import CompanyLogoSection from "./CompanyLogoSection";

const EDIT_ROLES = ["HR"];

type FieldConfig = {
  key: string;
  required?: boolean;
  spanFull?: boolean;
};

const generalFields: FieldConfig[] = [
  { key: "name", required: true },
  { key: "industry" },
  { key: "phone" },
  { key: "website" },
];

const locationFields: FieldConfig[] = [
  { key: "country" },
  { key: "city" },
  { key: "address", spanFull: true },
];

const legalFields: FieldConfig[] = [
  { key: "taxNumber" },
  { key: "commercialReg" },
  { key: "currency" },
  { key: "timezone" },
];

const sections: { titleKey: string; fields: FieldConfig[] }[] = [
  { titleKey: "general", fields: generalFields },
  { titleKey: "location", fields: locationFields },
  { titleKey: "legal", fields: legalFields },
];

export default function CompanyInfoForm() {
  const t = useTranslations("company.info");
  const { data, isLoading } = useCompanyInfo();
  const updateMutation = useUpdateCompanyInfo();
  const uploadLogoMutation = useUploadLogo();
  const deleteLogoMutation = useDeleteLogo();
  const { role } = useAuthStore();
  const canEdit = EDIT_ROLES.includes(role);

  const [form, setForm] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);

  if (data && !initialized) {
    const info = data.data;
    setForm({
      name: info.name ?? "",
      industry: info.industry ?? "",
      country: info.country ?? "",
      city: info.city ?? "",
      address: info.address ?? "",
      phone: info.phone ?? "",
      website: info.website ?? "",
      taxNumber: info.taxNumber ?? "",
      commercialReg: info.commercialReg ?? "",
      currency: info.currency ?? "",
      timezone: info.timezone ?? "",
    });
    setInitialized(true);
  }

  const changed = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const patch: Record<string, string> = {};
    if (data) {
      const original = data.data;
      for (const key of Object.keys(form)) {
        const k = key as keyof typeof form;
        if (form[k] !== (original[k as keyof typeof original] ?? "")) {
          patch[k] = form[k];
        }
      }
    }
    if (Object.keys(patch).length > 0) {
      updateMutation.mutate(patch);
    }
  };

  if (isLoading) {
    return <div className="text-content-muted p-6">{t("states.loading")}</div>;
  }

  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed";
  const fieldRow = "grid grid-cols-1 md:grid-cols-2 gap-4";

  return (
    <div className="space-y-8">
      <CompanyLogoSection
        logoUrl={data?.data.logoUrl ?? null}
        companyName={data?.data.name ?? ""}
        canEdit={canEdit}
        isUploading={uploadLogoMutation.isPending}
        isRemoving={deleteLogoMutation.isPending}
        onUpload={(file) => uploadLogoMutation.mutate(file)}
        onRemove={() => deleteLogoMutation.mutate()}
      />

      {sections.map(({ titleKey, fields }) => (
        <div key={titleKey} className="rounded-xl border border-gray-200 bg-card p-6">
          <h3 className="text-base font-semibold text-content-dark mb-4">{t(`sections.${titleKey}`)}</h3>
          <div className={fieldRow}>
            {fields.map(({ key, required, spanFull }) => (
              <div key={key} className={spanFull ? "md:col-span-2" : undefined}>
                <label className="block text-sm font-medium text-content mb-1">
                  {t(`fields.${key}`)}
                  {required && <span className="text-status-error"> *</span>}
                </label>
                <input
                  className={inputClass}
                  value={form[key] ?? ""}
                  onChange={(e) => changed(key, e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

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
