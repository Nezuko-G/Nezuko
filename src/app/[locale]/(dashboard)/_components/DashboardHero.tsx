"use client"
import { useTranslations } from "next-intl";
import { CalendarDays, Plus } from "lucide-react";

export default function DashboardHero() {
  const t = useTranslations("dashboard.hero");

  return (
    <div className="flex flex-col gap-6 w-full mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-gray-900">{t("greeting")} <span className="text-primary">محمود</span></h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <button className="px-4 py-2 bg-primary text-secondary rounded-md text-sm font-bold transition-all shadow-sm">
              {t("mainPage")}
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-900 rounded-md text-sm font-medium transition-all">
              {t("saudiDashboard")}
            </button>
          </div>
          <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-colors">
            <Plus size={20} />
          </button>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700">
            <CalendarDays size={18} className="text-primary" />
            <span>يوم الاثنين، ١٧ سبتمبر ٢٠٢٥</span>
          </div>
        </div>
      </div>

      <div className="w-full bg-white border border-primary/20 rounded-xl p-4 flex items-center shadow-sm">
        <p className="text-gray-700 text-sm font-medium">
           {t("announcement")}
        </p>
      </div>
    </div>
  );
}