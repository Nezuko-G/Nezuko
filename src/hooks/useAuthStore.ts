import { create } from "zustand";

export type UserRole = "HR" | "MANAGER" | "EMPLOYEE" | "TENANT_OWNER";

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

function getInitialRole(): UserRole {
  if (typeof window === "undefined") return "HR";
  const stored = localStorage.getItem("role") as UserRole | null;
  if (stored && ["HR", "MANAGER", "EMPLOYEE"].includes(stored)) return stored;
  return "HR";
}

export const useAuthStore = create<AuthState>((set) => ({
  role: getInitialRole(),
  setRole: (role) => set({ role }),
}));