"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  Calendar,
  Hash,
  LogOut,
  Camera,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { logout } from "@/app/(auth)/login/api/users";

interface Props {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    employeeCode?: string | null;
    jobTitle?: string | null;
    phone?: string | null;
    hireDate?: string | null;
  };
  avatarUrl?: string | null;
  onUpload?: (file: File) => void;
  isUploading?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function formatRole(role: string) {
  return role
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const FIELD_ICONS = { code: Hash, phone: Phone, hireDate: Calendar } as const;

export default function ProfileHeader({
  data,
  avatarUrl,
  onUpload,
  isUploading,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const t = useTranslations("profile");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      clearAuth();
      window.location.href = "/login";
    }
  };

  const initials = `${data.firstName[0]}${data.lastName[0]}`;

  const sidebarFields = [
    {
      key: "code",
      label: t("fields.code"),
      value: data.employeeCode,
      icon: FIELD_ICONS.code,
    },
    {
      key: "phone",
      label: t("fields.phone"),
      value: data.phone,
      icon: FIELD_ICONS.phone,
    },
    {
      key: "hireDate",
      label: t("fields.hireDate"),
      value: formatDate(data.hireDate),
      icon: FIELD_ICONS.hireDate,
    },
  ].filter((f) => f.value);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (!file || !onUpload) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("File must be JPEG, PNG, or WebP");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("File must be under 5MB");
      return;
    }

    onUpload(file);
    e.target.value = "";
  };

  return (
    <div className="w-full lg:w-64 shrink-0 bg-card rounded-2xl border border-gray-200 shadow-sm overflow-hidden self-start">
      <div className="h-1.5 bg-linear-to-r from-primary/40 via-primary to-primary/40" />

      <div className="px-6 pt-6 pb-5 flex flex-col items-center gap-3">
        <div className="relative w-20 h-20 group">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={`${data.firstName} ${data.lastName}`}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-sm"
              unoptimized
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-extrabold text-2xl ring-4 ring-white shadow-sm">
              {initials}
            </div>
          )}

          {onUpload && (
            <button
              onClick={() => !isUploading && fileInputRef.current?.click()}
              disabled={isUploading}
              className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed transition-opacity ${
                isUploading
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {isUploading ? (
                <Loader2 size={18} className="text-white animate-spin" />
              ) : (
                <Camera size={18} className="text-white" />
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {error && <p className="text-xs text-status-error">{error}</p>}

        <div className="text-center">
          <h2 className="font-bold text-secondary text-lg">
            {data.firstName} {data.lastName}
          </h2>
          {data.jobTitle && (
            <p className="text-content-muted text-sm font-medium">
              {data.jobTitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-content-muted">
          <Mail size={12} className="text-primary" />
          <span className="truncate max-w-[180px]">{data.email}</span>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
            {formatRole(data.role)}
          </span>
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold",
              data.isActive
                ? "bg-status-success/10 text-status-success"
                : "bg-status-error/10 text-status-error",
            )}
          >
            {data.isActive ? t("active") : t("inactive")}
          </span>
        </div>
      </div>

      {sidebarFields.length > 0 && (
        <div className="px-6 pb-5 flex flex-col gap-2.5 border-t border-gray-100 pt-4">
          {sidebarFields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Icon size={13} className="text-primary/60" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-content-muted/60">
                    {field.label}
                  </span>
                  <span className="text-xs font-bold text-secondary truncate">
                    {field.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="px-6 pb-5 border-t border-gray-100 pt-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-semibold disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
          Logout
        </button>
      </div>
    </div>
  );
}
