import { create } from "zustand";

export type UserRole = "HR_ADMIN" | "MANAGER" | "EMPLOYEE" | "TENANT_OWNER";

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

function getInitialRole(): UserRole {
  if (typeof window === "undefined") return "HR_ADMIN";
  const stored = localStorage.getItem("role") as UserRole | null;
  if (stored && ["HR_ADMIN", "MANAGER", "EMPLOYEE"].includes(stored)) return stored;
  return "HR_ADMIN";
}

export const useAuthStore = create<AuthState>((set) => ({
  role: getInitialRole(),
  setRole: (role) => set({ role }),
}));