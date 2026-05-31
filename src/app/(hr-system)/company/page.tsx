"use client";

import { useTranslations } from "next-intl";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import CompanyTabs from "./_components/CompanyTabs";
import CompanyInfoForm from "./_components/CompanyInfoForm";
import GeneralSettingsForm from "./_components/GeneralSettingsForm";
import AttendanceSettingsForm from "./_components/AttendanceSettingsForm";

type Tab = "info" | "general" | "attendance";
const TAB_KEYS: readonly Tab[] = ["info", "general", "attendance"];

export default function CompanyPage() {
  const t = useTranslations("company.page");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = rawTab && TAB_KEYS.includes(rawTab) ? rawTab : "info";

  const setActiveTab = useCallback(
    (tab: Tab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-content-dark mb-1">{t("title")}</h1>
      <p className="text-sm text-content-muted mb-6">{t("subtitle")}</p>

      <CompanyTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "info" && <CompanyInfoForm />}
      {activeTab === "general" && <GeneralSettingsForm />}
      {activeTab === "attendance" && <AttendanceSettingsForm />}
    </div>
  );
}
