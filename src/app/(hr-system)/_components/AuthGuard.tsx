"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";

const roleRouteMap: Record<string, string[]> = {
  '/employees': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/jobs': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/insurance': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/projects': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
  '/reports': ['HR_ADMIN', 'MANAGER', 'TENANT_OWNER'],
};

const protectedPaths = [
  '/dashboard', '/profile', '/employees', '/departments',
  '/asset', '/attendance', '/insurance', '/jobs',
  '/leave', '/timesheets', '/projects', '/reports',
  '/company', '/chatbot',
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

    const matchedPrefix = protectedPaths.find(
      (p) => pathname === p || pathname.startsWith(p + "/"),
    );

    if (matchedPrefix && roleRouteMap[matchedPrefix]) {
      if (!roleRouteMap[matchedPrefix].includes(role)) {
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

  const matchedPrefix = protectedPaths.find(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
  if (matchedPrefix && roleRouteMap[matchedPrefix] && !roleRouteMap[matchedPrefix].includes(role)) return null;

  return <>{children}</>;
}
