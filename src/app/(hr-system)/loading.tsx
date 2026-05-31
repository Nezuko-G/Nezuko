"use client";

import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("dashboard.loading");

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-content-muted">{t("text")}</span>
          <span className="w-1 h-1 rounded-full bg-content-muted animate-bounce [animation-delay:0ms]" />
          <span className="w-1 h-1 rounded-full bg-content-muted animate-bounce [animation-delay:150ms]" />
          <span className="w-1 h-1 rounded-full bg-content-muted animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
