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
  const stored = localStorage.getItem("role") as UserRole | null;
  if (stored && ALL_ROLES.includes(stored)) return stored;
  return "EMPLOYEE";
}

export const useAuthStore = create<AuthState>((set) => ({
  role: getInitialRole(),
  isHydrated: typeof window !== "undefined",
  setRole: (role) => set({ role }),
}));