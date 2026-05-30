"use client";

import { ReactNode, useEffect } from "react";
import { useAuthStore, UserRole } from "@/hooks/useAuthStore";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

const ALL_ROLES: UserRole[] = ["HR_ADMIN", "MANAGER", "EMPLOYEE", "TENANT_OWNER"];

export default function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { role, isHydrated } = useAuthStore();

  useEffect(() => {
    if (allowedRoles.length === 0) {
      console.warn("RoleGuard: allowedRoles is empty — no roles will match");
    }
  }, [allowedRoles]);

  if (allowedRoles.some((r) => !ALL_ROLES.includes(r))) {
    console.warn("RoleGuard: invalid role in allowedRoles", allowedRoles);
  }

  if (!isHydrated) {
    return fallback ?? null;
  }

  if (!allowedRoles.includes(role)) {
    return fallback ?? null;
  }

  return <>{children}</>;
}