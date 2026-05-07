"use client"
import { useTranslations } from "next-intl";
import { Plane, Frown, Megaphone, DollarSign } from "lucide-react";

export default function LeaveBalances() {
  const t = useTranslations("dashboard.leaveBalances");

  const balances = [
    { id: 1, title: t("annual"), value: "١٥/٣", unit: t("day"), icon: Plane, iconBg: "bg-blue-50", iconColor: "text-blue-500" },
    { id: 2, title: t("sick"), value: "٦", unit: t("days"), icon: Frown, iconBg: "bg-orange-50", iconColor: "text-orange-500" },
    { id: 3, title: t("official"), value: "٣", unit: t("days"), icon: Megaphone, iconBg: "bg-gray-100", iconColor: "text-gray-500" },
    { id: 4, title: t("unpaid"), value: "٣", unit: t("days"), icon: DollarSign, iconBg: "bg-yellow-50", iconColor: "text-yellow-600" },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-bold text-gray-900">{t("title")}</h2>
        <button className="text-primary text-sm font-bold hover:underline">
          {t("requestLeave")}
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {balances.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-md">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.iconBg}`}>
                <Icon size={24} className={item.iconColor} strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm font-medium mb-1">{item.title}</p>
                <p className="text-xl font-black text-gray-900">
                  {item.value} <span className="text-sm font-medium text-gray-500">{item.unit}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}