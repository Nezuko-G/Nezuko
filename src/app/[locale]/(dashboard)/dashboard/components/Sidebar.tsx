"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, Users, Clock, Calendar, Briefcase, Folder, BarChart, Star, Settings, SquareArrowRightExitIcon } from "lucide-react";

export default function Sidebar() {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: t("home"), href: "/dashboard" },
    { icon: Users, label: t("employees"), href: "/employees" },
    { icon: Clock, label: t("time"), href: "/time" },
    { icon: SquareArrowRightExitIcon, label: t("leave"), href: "/leave" },
    { icon: Briefcase, label: t("payroll"), href: "/payroll" },
    { icon: Folder, label: t("projects"), href: "/projects" },
    { icon: BarChart, label: t("reports"), href: "/reports" },
    { icon: Star, label: t("favorites"), href: "/favorites" },
    { icon: Settings, label: t("settings"), href: "/settings" },
  ];

  const isActive = (href: string) => {
    const path = pathname.replace(/^\/[^/]+/, "") || "/";
    if (href === "/dashboard") {
      return path === "/dashboard" || path === "/dashboard/";
    }
    return path === href || path === `${href}/`;
  };

  return (
    <aside className="w-20 bg-secondary min-h-screen flex flex-col items-center py-6 gap-6 sticky top-0 shrink-0 z-20">
      <Link href="/dashboard" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4 transition-transform hover:scale-105">
        <span className="text-secondary font-black text-xl">N</span>
      </Link>

      <nav className="flex flex-col gap-4 w-full px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${
                active
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