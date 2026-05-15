"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import CompanyTabs from "./_components/CompanyTabs";
import CompanyInfoForm from "./_components/CompanyInfoForm";
import GeneralSettingsForm from "./_components/GeneralSettingsForm";
import AttendanceSettingsForm from "./_components/AttendanceSettingsForm";

type Tab = "info" | "general" | "attendance";
const TABS: readonly Tab[] = ["info", "general", "attendance"];

export default function CompanyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = rawTab && TABS.includes(rawTab) ? rawTab : "info";

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
      <h1 className="text-xl font-bold text-content-dark mb-1">Company Settings</h1>
      <p className="text-sm text-content-muted mb-6">Manage your company profile and preferences</p>

      <CompanyTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "info" && <CompanyInfoForm />}
      {activeTab === "general" && <GeneralSettingsForm />}
      {activeTab === "attendance" && <AttendanceSettingsForm />}
    </div>
  );
}
