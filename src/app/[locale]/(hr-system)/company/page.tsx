"use client";

import { useState } from "react";
import CompanyTabs from "./_components/CompanyTabs";
import CompanyInfoForm from "./_components/CompanyInfoForm";
import GeneralSettingsForm from "./_components/GeneralSettingsForm";
import AttendanceSettingsForm from "./_components/AttendanceSettingsForm";

type Tab = "info" | "general" | "attendance";

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("info");

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
