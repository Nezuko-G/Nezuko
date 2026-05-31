"use client";

import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function UnauthorizedPage() {
  const t = useTranslations("dashboard.unauthorized");
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center gap-5 text-center max-w-md">
        <div className="w-14 h-14 rounded-full bg-status-error/10 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-status-error" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-content-dark">{t("title")}</h2>
          <p className="text-sm text-content-muted leading-relaxed">
            {t("description")}
          </p>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20"
        >
          <ArrowLeft size={16} />
          {t("back")}
        </button>
      </div>
    </div>
  );
}
