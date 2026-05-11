"use client"
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Home, Users, Clock, Briefcase, Folder, BarChart, Star, Settings } from "lucide-react";

export default function Sidebar() {
  const t = useTranslations("dashboard.sidebar");

  const menuItems = [
    { icon: Home, label: t("home"), href: "/dashboard" },
    { icon: Users, label: t("employees"), href: "/dashboard/employees" },
    { icon: Clock, label: t("time"), href: "/dashboard/time" },
    { icon: Briefcase, label: t("payroll"), href: "/dashboard/payroll" },
    { icon: Folder, label: t("projects"), href: "/dashboard/projects" },
    { icon: BarChart, label: t("reports"), href: "/dashboard/reports" },
    { icon: Star, label: t("favorites"), href: "/dashboard/favorites" },
    { icon: Settings, label: t("settings"), href: "/dashboard/settings" },
  ];

  return (
    <aside className="w-20 bg-secondary min-h-screen flex flex-col items-center py-6 gap-6 sticky top-0 shrink-0 z-20">
      <Link href="/dashboard" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4 transition-transform hover:scale-105">
        <span className="text-secondary font-black text-xl">N</span>
      </Link>

      <nav className="flex flex-col gap-4 w-full px-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              title={item.label}
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                index === 0
                  ? "bg-primary text-secondary shadow-lg shadow-primary/20"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={22} strokeWidth={1.5} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}