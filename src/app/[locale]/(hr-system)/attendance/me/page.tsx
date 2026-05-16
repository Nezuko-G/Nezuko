"use client";

import { useTranslations } from "next-intl";

export default function MyAttendancePage() {
  const t = useTranslations("timesheet");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-secondary mb-4">{t("myAttendance")}</h1>
      <p className="text-gray-400">{t("comingSoon")}</p>
    </div>
  );
}
