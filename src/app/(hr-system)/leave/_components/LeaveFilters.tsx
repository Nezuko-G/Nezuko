"use client";

import { useTranslations } from "next-intl";

interface Props {
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function LeaveFilters({ statusFilter, onStatusChange }: Props) {
  const t = useTranslations("leave.filters");

  return (
    <select
      value={statusFilter}
      onChange={(e) => onStatusChange(e.target.value)}
      className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm font-semibold focus:outline-none cursor-pointer"
    >
      <option value="ALL">{t("all")}</option>
      <option value="PENDING">{t("pending")}</option>
      <option value="APPROVED">{t("approved")}</option>
      <option value="REJECTED">{t("rejected")}</option>
      <option value="CANCELLED">{t("cancelled")}</option>
    </select>
  );
}
