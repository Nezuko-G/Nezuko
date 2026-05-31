"use client";

import { useTranslations } from "next-intl";

interface InsurancePlanTypeBadgeProps {
  type: "BASIC" | "STANDARD" | "PREMIUM";
}

export default function InsurancePlanTypeBadge({
  type,
}: InsurancePlanTypeBadgeProps) {
  const t = useTranslations("insurance.types");

  const getBadgeStyle = () => {
    switch (type) {
      case "BASIC":
        return "bg-gray-100 text-gray-600";
      case "STANDARD":
        return "bg-blue-50 text-blue-600";
      case "PREMIUM":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle()}`}
    >
      {t(type)}
    </span>
  );
}
