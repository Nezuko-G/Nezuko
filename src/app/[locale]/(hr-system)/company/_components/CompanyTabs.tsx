"use client";

import { useTranslations } from "next-intl";

type Tab = "info" | "general" | "attendance";

const TAB_KEYS: Tab[] = ["info", "general", "attendance"];

export default function CompanyTabs({
  activeTab,
  onChange,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}) {
  const t = useTranslations("company.tabs");

  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6">
      {TAB_KEYS.map((key) => {
        const active = key === activeTab;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active
                ? "border-primary text-primary"
                : "border-transparent text-content-muted hover:text-content"
            }`}
          >
            {t(key)}
          </button>
        );
      })}
    </div>
  );
}
