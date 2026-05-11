import { create } from "zustand";

export type UserRole = "HR" | "MANAGER" | "EMPLOYEE";

interface AuthState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: "HR", 
  setRole: (role) => set({ role }),
}));