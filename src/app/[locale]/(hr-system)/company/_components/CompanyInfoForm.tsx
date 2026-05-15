"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useCompanyInfo, useUpdateCompanyInfo, useUploadLogo, useDeleteLogo } from "../hooks/useCompany";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button";

const EDIT_ROLES = ["HR"];

export default function CompanyInfoForm() {
  const { data, isLoading } = useCompanyInfo();
  const updateMutation = useUpdateCompanyInfo();
  const uploadLogoMutation = useUploadLogo();
  const deleteLogoMutation = useDeleteLogo();
  const { role } = useAuthStore();
  const canEdit = EDIT_ROLES.includes(role);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogoMutation.mutate(file);
  };

  if (isLoading) {
    return <div className="text-content-muted p-6">Loading...</div>;
  }

  const labelClass = "block text-sm font-medium text-content mb-1";
  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed";
  const fieldRow = "grid grid-cols-1 md:grid-cols-2 gap-4";

  return (
    <div className="space-y-8">
      {/* ── Logo Section ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">Logo</h3>
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
            {data?.data.logoUrl ? (
              <Image src={data.data.logoUrl} alt="Company logo" width={80} height={80} className="h-full w-full object-contain" />
            ) : (
              <span className="text-2xl font-bold text-gray-300">N</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!canEdit || uploadLogoMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadLogoMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
            {data?.data.logoUrl && (
              <Button
                type="button"
                variant="outline"
                disabled={!canEdit || deleteLogoMutation.isPending}
                onClick={() => deleteLogoMutation.mutate()}
              >
                Remove
              </Button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
      </div>

      {/* ── General ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">General</h3>
        <div className={fieldRow}>
          <div>
            <label className={labelClass}>Name <span className="text-status-error">*</span></label>
            <input className={inputClass} value={form.name ?? ""} onChange={(e) => changed("name", e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <label className={labelClass}>Industry</label>
            <input className={inputClass} value={form.industry ?? ""} onChange={(e) => changed("industry", e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} value={form.phone ?? ""} onChange={(e) => changed("phone", e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input className={inputClass} value={form.website ?? ""} onChange={(e) => changed("website", e.target.value)} disabled={!canEdit} />
          </div>
        </div>
      </div>

      {/* ── Location ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">Location</h3>
        <div className={fieldRow}>
          <div>
            <label className={labelClass}>Country</label>
            <input className={inputClass} value={form.country ?? ""} onChange={(e) => changed("country", e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input className={inputClass} value={form.city ?? ""} onChange={(e) => changed("city", e.target.value)} disabled={!canEdit} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Address</label>
            <input className={inputClass} value={form.address ?? ""} onChange={(e) => changed("address", e.target.value)} disabled={!canEdit} />
          </div>
        </div>
      </div>

      {/* ── Legal & Financial ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">Legal &amp; Financial</h3>
        <div className={fieldRow}>
          <div>
            <label className={labelClass}>Tax Number</label>
            <input className={inputClass} value={form.taxNumber ?? ""} onChange={(e) => changed("taxNumber", e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <label className={labelClass}>Commercial Registration</label>
            <input className={inputClass} value={form.commercialReg ?? ""} onChange={(e) => changed("commercialReg", e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <label className={labelClass}>Currency</label>
            <input className={inputClass} value={form.currency ?? ""} onChange={(e) => changed("currency", e.target.value)} disabled={!canEdit} />
          </div>
          <div>
            <label className={labelClass}>Timezone</label>
            <input className={inputClass} value={form.timezone ?? ""} onChange={(e) => changed("timezone", e.target.value)} disabled={!canEdit} />
          </div>
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
