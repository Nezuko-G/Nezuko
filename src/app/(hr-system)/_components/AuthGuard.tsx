"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";

const roleRouteMap: Record<string, string[]> = {
  '/employees': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/jobs': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/insurance': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/projects': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/reports': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/tasks/me': ['EMPLOYEE', 'HR_ADMIN'],
  '/tasks/report/overdue': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
};

const protectedPaths = [
  '/dashboard', '/profile', '/employees', '/departments',
  '/asset', '/attendance', '/insurance', '/jobs',
  '/leave', '/timesheets', '/projects', '/reports',
  '/company', '/chatbot', '/tasks',
];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setHydrated(true); }, []);

  const raw = hydrated ? localStorage.getItem("auth") : null;
  const auth = raw ? (JSON.parse(raw) as { isAuthenticated?: boolean; role?: string }) : {};
  const isAuth = hydrated && auth.isAuthenticated === true;
  const role = hydrated ? auth.role || "" : "";

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuth) {
      router.replace("/login");
      return;
    }

    if (role === "EMPLOYEE" && pathname === "/dashboard") {
      router.replace("/unauthorized");
      return;
    }

    const matchedRoute = roleRouteMap[pathname]
      ? pathname
      : protectedPaths.find(
          (p) => pathname === p || pathname.startsWith(p + "/"),
        );

    if (matchedRoute && roleRouteMap[matchedRoute]) {
      if (!roleRouteMap[matchedRoute].includes(role)) {
        router.replace("/unauthorized");
        return;
      }
    }
  }, [pathname, router, hydrated, isAuth, role]);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuth) return null;
  if (role === "EMPLOYEE" && pathname === "/dashboard") return null;

  const matchedRoute = roleRouteMap[pathname]
    ? pathname
    : protectedPaths.find(
        (p) => pathname === p || pathname.startsWith(p + "/"),
      );
  if (matchedRoute && roleRouteMap[matchedRoute] && !roleRouteMap[matchedRoute].includes(role)) return null;

  return <>{children}</>;
}
