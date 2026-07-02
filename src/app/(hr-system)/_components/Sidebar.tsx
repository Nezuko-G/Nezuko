"use client";
import { useTranslations } from "next-intl";
import {
  Users,
  Package,
  ShieldAlert,
  Folder,
  Clock,
  CalendarDays,
  FilePieChart,
  Network,
  Building2,
  FileText,
  Briefcase,
  Wallet,
  Gift,
  CheckSquare,
  AlertTriangle,
  FilePlus,
  LucideIcon
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuthStore, UserRole } from "@/hooks/useAuthStore";

export default function Sidebar() {
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();
  const { role } = useAuthStore();

  const menuItems: {
    icon: LucideIcon;
    label: string;
    href: string;
    allowedRoles?: UserRole[];
  }[] = [
    { icon: Users,        label: t("employees"),    href: "/employees",         allowedRoles: ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] },
    { icon: Briefcase,    label: t("jobs"),         href: "/jobs",              allowedRoles: ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] },
    { icon: Package,      label: t("assets"),       href: "/asset",             allowedRoles: ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] },
    { icon: ShieldAlert,  label: t("insurance"),    href: "/insurance",         allowedRoles: ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] },
    { icon: Folder,       label: t("projects"),     href: "/projects",          allowedRoles: ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] },
    { icon: CheckSquare,  label: t("myTasks"),      href: "/tasks/me",          allowedRoles: ["HR_ADMIN","EMPLOYEE"] },
    { icon: AlertTriangle,label: t("overdueReport"),href: "/tasks/report/overdue",allowedRoles: ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] },
    { icon: Clock,        label: t("attendance"),   href: "/attendance",        allowedRoles: ["EMPLOYEE"] },
    { icon: FileText,     label: t("timesheets"),   href: "/timesheets" ,       allowedRoles: ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] },
    { icon: CalendarDays, label: t("leave"),        href: "/leave" },
    { icon: Wallet,       label: t("payroll"),      href: "/payroll/runs",      allowedRoles: ["HR_ADMIN", "TENANT_OWNER"] },
    { icon: Gift,         label: t("incentives"),   href: "/payroll/incentives",allowedRoles: ["HR_ADMIN", "TENANT_OWNER"] },
    { icon: FilePieChart, label: t("reports"),      href: "/reports",           allowedRoles: ["HR_ADMIN", "MANAGER", "TENANT_OWNER"] },
    { icon: Network,      label: t("departments"),  href: "/departments" },
    { icon: Building2,    label: t("company"),      href: "/company" },
  ];

  return (
    <aside className="w-20 bg-secondary min-h-screen flex flex-col items-center py-6 gap-6 sticky top-0 shrink-0 z-20">
      <Link
        href={role === "EMPLOYEE" ? "/profile" : "/dashboard"}
        className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-4 transition-transform hover:scale-105"
      >
        <span className="text-secondary font-black text-xl">N</span>
      </Link>

      <nav className="flex flex-col gap-4 w-full px-4">
        {menuItems
          .filter((item) => !item.allowedRoles || item.allowedRoles.includes(role))
          .map((item, index) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={index}
                href={item.href}
                title={item.label}
                className={`p-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
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