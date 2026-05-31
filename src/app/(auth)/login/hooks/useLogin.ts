"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { login } from "../api/auth.api";
import { useAuthStore } from "@/hooks/useAuthStore";

export function useLogin() {
  const setRole = useAuthStore((s) => s.setRole);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      companyEmail: string;
      userEmail: string;
      password: string;
    }) => login(data),
    onSuccess: (response) => {
      const role = response?.data?.user?.role || response?.user?.role;

      localStorage.setItem(
        "auth",
        JSON.stringify({ isAuthenticated: true, role: role || "" }),
      );

      setRole(role || "EMPLOYEE");
      if (role === "EMPLOYEE") {
        router.push("/profile");
      } else {
        router.push("/dashboard");
      }
    },
  });
}
