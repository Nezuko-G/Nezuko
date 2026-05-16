"use client";
import { useTranslations } from "next-intl";
import {
  Home,
  Users,
  Package,
  ShieldAlert,
  Folder,
  Clock,
  CalendarDays,
  FilePieChart,
  Network,
  Building2,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

export default function Sidebar() {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: t("home"), href: "/dashboard" },
    { icon: Users, label: t("employees"), href: "/employees" },
    { icon: Package, label: t("assets"), href: "/asset" },
    { icon: ShieldAlert, label: t("insurance"), href: "/insurance" },
    { icon: Folder, label: t("projects"), href: "/projects" },
    { icon: Clock, label: t("attendance"), href: "/attendance" },
    { icon: CalendarDays, label: t("leave"), href: "/leave" },
    { icon: FilePieChart, label: t("reports"), href: "/reports" },
    { icon: Network, label: t("departments"), href: "/departments" },
    { icon: Building2, label: t("company"), href: "/company" },
  ];

  
  return (
    <aside className="w-20 bg-secondary min-h-screen flex flex-col items-center py-6 gap-6 sticky top-0 shrink-0 z-20">
      <Link
        href="/dashboard"
        className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4 transition-transform hover:scale-105"
      >
        <span className="text-secondary font-black text-xl">N</span>
      </Link>

      <nav className="flex flex-col gap-4 w-full px-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={index}
              href={item.href}
              title={item.label}
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                isActive
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
