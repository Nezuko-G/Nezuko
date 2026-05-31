import { create } from "zustand";

export type UserRole = "HR_ADMIN" | "MANAGER" | "EMPLOYEE" | "TENANT_OWNER";

interface AuthState {
  role: UserRole;
  isHydrated: boolean;
  setRole: (role: UserRole) => void;
}

const ALL_ROLES: UserRole[] = ["HR_ADMIN", "MANAGER", "EMPLOYEE", "TENANT_OWNER"];

function getInitialRole(): UserRole {
  if (typeof window === "undefined") return "EMPLOYEE";
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return "EMPLOYEE";
    const parsed = JSON.parse(raw) as { role?: UserRole };
    if (parsed.role && ALL_ROLES.includes(parsed.role)) return parsed.role;
  } catch {}
  return "EMPLOYEE";
}

export const useAuthStore = create<AuthState>((set) => ({
  role: getInitialRole(),
  isHydrated: typeof window !== "undefined",
  setRole: (role) => set({ role }),
}));