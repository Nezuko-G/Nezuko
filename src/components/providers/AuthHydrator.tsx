"use client";

import { useRef } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import type { ProfileData } from "@/app/(hr-system)/profile/api/profile.api";
import type {UserRole} from "@/hooks/useAuthStore";

interface AuthHydratorProps {
  user: ProfileData | null;
}

export function AuthHydrator({ user }: AuthHydratorProps) {
  const initialized = useRef(false);

  if (!initialized.current) {
    if (user) {
      useAuthStore.getState().setUserData({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as UserRole,
        avatarUrl: user.avatarUrl,
      });
    } else {
      useAuthStore.setState({ isHydrated: true });
    }
    initialized.current = true;
  }

  return null; 
}
