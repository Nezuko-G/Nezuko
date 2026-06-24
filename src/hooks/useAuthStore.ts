import { create } from "zustand";
import { readAvatarFromStorage, writeAvatarToStorage, removeAvatarFromStorage } from "@/lib/avatar";

export type UserRole = "HR_ADMIN" | "MANAGER" | "EMPLOYEE" | "TENANT_OWNER";

interface AuthState {
  role: UserRole;
  isHydrated: boolean;
  avatarBase64: string | null;
  avatarUpdatedAt: number | null;
  firstName: string | null;
  lastName: string | null;
  setRole: (role: UserRole) => void;
  setAvatarBase64: (base64: string) => void;
  setUserData: (data: { firstName: string; lastName: string; avatarBase64?: string }) => void;
  clearAvatar: () => void;
  clearAuth: () => void;
}

const ALL_ROLES: UserRole[] = ["HR_ADMIN", "MANAGER", "EMPLOYEE", "TENANT_OWNER"];

interface StoredAuth {
  isAuthenticated?: boolean;
  role?: UserRole;
  firstName?: string | null;
  lastName?: string | null;
}

function getInitialAuth(): StoredAuth {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return {};
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return {};
  }
}

const stored = getInitialAuth();
const avatar = readAvatarFromStorage();

export const useAuthStore = create<AuthState>((set) => ({
  role: (stored.role && ALL_ROLES.includes(stored.role) ? stored.role : "EMPLOYEE") as UserRole,
  isHydrated: typeof window !== "undefined",
  avatarBase64: avatar.base64,
  avatarUpdatedAt: avatar.updatedAt,
  firstName: stored.firstName ?? null,
  lastName: stored.lastName ?? null,

  setRole: (role) => {
    set({ role });
    const raw = localStorage.getItem("auth");
    const auth = raw ? JSON.parse(raw) : {};
    auth.role = role;
    auth.isAuthenticated = true;
    localStorage.setItem("auth", JSON.stringify(auth));
  },

  setAvatarBase64: (base64) => {
    const now = Date.now();
    set({ avatarBase64: base64, avatarUpdatedAt: now });
    writeAvatarToStorage(base64);
  },

  setUserData: (data) => {
    const next: Partial<AuthState> = {
      firstName: data.firstName,
      lastName: data.lastName,
    };
    const raw = localStorage.getItem("auth");
    const auth = raw ? JSON.parse(raw) : {};
    auth.firstName = data.firstName;
    auth.lastName = data.lastName;
    set(next as AuthState);
    localStorage.setItem("auth", JSON.stringify(auth));

    if (data.avatarBase64) {
      set({ avatarBase64: data.avatarBase64, avatarUpdatedAt: Date.now() });
      writeAvatarToStorage(data.avatarBase64);
    }
  },

  clearAvatar: () => {
    set({ avatarBase64: null, avatarUpdatedAt: null });
    removeAvatarFromStorage();
  },

  clearAuth: () => {
    set({ role: "EMPLOYEE" as UserRole, avatarBase64: null, avatarUpdatedAt: null, firstName: null, lastName: null });
    localStorage.removeItem("auth");
    removeAvatarFromStorage();
  },
}));
