"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useCompanyInfo, useUpdateCompanyInfo, useUploadLogo, useDeleteLogo } from "../hooks/useCompany";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button";

const EDIT_ROLES = ["HR"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function CompanyInfoForm() {
  const { data, isLoading } = useCompanyInfo();
  const updateMutation = useUpdateCompanyInfo();
  const uploadLogoMutation = useUploadLogo();
  const deleteLogoMutation = useDeleteLogo();
  const { role } = useAuthStore();
  const canEdit = EDIT_ROLES.includes(role);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Record<string, string>>({});
  const [initialized, setInitialized] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

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

  const validateFile = (file: File) => {
    setLogoError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLogoError("Only JPEG, PNG, WebP, and SVG files are allowed.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setLogoError("File size must be under 5MB.");
      return false;
    }
    return true;
  };

  const handleLogoFile = (file: File) => {
    if (validateFile(file)) uploadLogoMutation.mutate(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleLogoFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleLogoFile(file);
  };

  if (isLoading) {
    return <div className="text-content-muted p-6">Loading...</div>;
  }

  const labelClass = "block text-sm font-medium text-content mb-1";
  const inputClass = "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed";
  const fieldRow = "grid grid-cols-1 md:grid-cols-2 gap-4";

  const companyName = data?.data.name ?? "";
  const initials = getInitials(companyName) || "N";
  const hasLogo = !!data?.data.logoUrl;
  const isPending = uploadLogoMutation.isPending || deleteLogoMutation.isPending;

  return (
    <div className="space-y-8">
      {/* ── Logo Section ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">Logo</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            ref={dropRef}
            onDragOver={canEdit ? handleDragOver : undefined}
            onDragLeave={canEdit ? handleDragLeave : undefined}
            onDrop={canEdit ? handleDrop : undefined}
            className={`relative h-24 w-24 shrink-0 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : hasLogo
                  ? "border-gray-200 bg-gray-50"
                  : "border-gray-300 bg-gray-50/50"
            } ${canEdit ? "cursor-pointer" : "cursor-default"}`}
            onClick={() => canEdit && !isPending && fileInputRef.current?.click()}
          >
            {isPending ? (
              <div className="flex flex-col items-center gap-1">
                <svg className="animate-spin h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-[10px] text-content-muted">{uploadLogoMutation.isPending ? "Uploading" : "Removing"}</span>
              </div>
            ) : hasLogo ? (
              <>
                <Image src={`${data.data.logoUrl}`} alt="Company logo" width={96} height={96} className="h-full w-full object-fit" />
                {canEdit && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                    <span className="text-white text-xs font-medium">Change</span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-300 select-none">{initials}</span>
            )}
            {dragOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-xl">
                <span className="text-primary text-sm font-medium">Drop here</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canEdit || isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                {hasLogo ? "Change" : "Upload"}
              </Button>
              {hasLogo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!canEdit || deleteLogoMutation.isPending}
                  onClick={() => deleteLogoMutation.mutate()}
                >
                  Remove
                </Button>
              )}
            </div>
            {canEdit && (
              <p className="text-xs text-content-muted">JPEG, PNG, WebP or SVG. Max 5MB.</p>
            )}
            {logoError && (
              <p className="text-xs text-status-error">{logoError}</p>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
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
