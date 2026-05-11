"use client";

import { ReactNode } from "react";
import { useAuthStore, UserRole } from "@/hooks/useAuthStore";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export default function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role } = useAuthStore();

  if (!allowedRoles.includes(role)) {
    return null; 
  }

  return <>{children}</>;
}