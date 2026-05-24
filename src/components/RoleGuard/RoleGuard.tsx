"use client";

import { ReactNode } from "react";
import { useAuthStore, UserRole } from "@/hooks/useAuthStore";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const { role } = useAuthStore();

  if (!allowedRoles.includes(role)) {
    return fallback ?? null;
  }

  return <>{children}</>;
}