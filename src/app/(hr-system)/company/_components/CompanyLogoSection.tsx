"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

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

type Props = {
  logoUrl: string | null;
  companyName: string;
  canEdit: boolean;
  isUploading: boolean;
  isRemoving: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
};

export default function CompanyLogoSection({
  logoUrl,
  companyName,
  canEdit,
  isUploading,
  isRemoving,
  onUpload,
  onRemove,
}: Props) {
  const t = useTranslations("company.info");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const isPending = isUploading || isRemoving;
  const hasLogo = !!logoUrl;
  const initials = getInitials(companyName) || "N";

  const validateFile = (file: File) => {
    setLogoError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLogoError(t("logo.errors.fileType"));
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setLogoError(t("logo.errors.fileSize"));
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) onUpload(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
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
    if (file) handleFile(file);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-card p-6">
      <h3 className="text-base font-semibold text-content-dark mb-4">{t("sections.logo")}</h3>
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
              <span className="text-[10px] text-content-muted">{isUploading ? t("logo.uploading") : t("logo.removing")}</span>
            </div>
          ) : hasLogo ? (
            <>
              <Image src={logoUrl} alt="Company logo" width={96} height={96} className="h-full w-full object-fit" />
              {canEdit && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                  <span className="text-white text-xs font-medium">{t("logo.changeOverlay")}</span>
                </div>
              )}
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-300 select-none">{initials}</span>
          )}
          {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-xl">
              <span className="text-primary text-sm font-medium">{t("logo.dropHere")}</span>
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
              {hasLogo ? t("logo.change") : t("logo.upload")}
            </Button>
            {hasLogo && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canEdit || isRemoving}
                onClick={onRemove}
              >
                {t("logo.remove")}
              </Button>
            )}
          </div>
          {canEdit && (
            <p className="text-xs text-content-muted">{t("logo.acceptedFormats")}</p>
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
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
}
