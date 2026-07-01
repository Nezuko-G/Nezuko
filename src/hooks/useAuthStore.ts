import { create } from "zustand";

export type UserRole = "HR_ADMIN" | "MANAGER" | "EMPLOYEE" | "TENANT_OWNER";

interface AuthState {
  id: string | null;
  role: UserRole;
  isHydrated: boolean;
  avatarUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  setUserData: (data: { id?: string; firstName?: string; lastName?: string; avatarUrl?: string | null; role?: UserRole }) => void;
  clearAuth: () => void;
}

const ALL_ROLES: UserRole[] = ["HR_ADMIN", "MANAGER", "EMPLOYEE", "TENANT_OWNER"];

export const useAuthStore = create<AuthState>((set) => ({
  id: null,
  role: "EMPLOYEE",
  isHydrated: false,
  avatarUrl: null,
  firstName: null,
  lastName: null,

  setUserData: (data) => {
    const next: Partial<AuthState> = { isHydrated: true };
    if (data.id !== undefined) next.id = data.id;
    if (data.firstName !== undefined) next.firstName = data.firstName;
    if (data.lastName !== undefined) next.lastName = data.lastName;
    if (data.avatarUrl !== undefined) next.avatarUrl = data.avatarUrl;
    if (data.role !== undefined && ALL_ROLES.includes(data.role)) next.role = data.role;
    
    set(next as AuthState);
  },

  clearAuth: () => {
    set({ id: null, role: "EMPLOYEE", isHydrated: false, avatarUrl: null, firstName: null, lastName: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
    }
  },
}));