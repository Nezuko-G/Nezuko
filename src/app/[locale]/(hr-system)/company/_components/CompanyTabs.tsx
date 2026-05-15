"use client";

type Tab = "info" | "general" | "attendance";

const TABS: { key: Tab; label: string }[] = [
  { key: "info", label: "Company Info" },
  { key: "general", label: "General Settings" },
  { key: "attendance", label: "Attendance Settings" },
];

export default function CompanyTabs({
  activeTab,
  onChange,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-gray-200 mb-6">
      {TABS.map((t) => {
        const active = t.key === activeTab;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active
                ? "border-primary text-primary"
                : "border-transparent text-content-muted hover:text-content"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
