"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "@/i18n/navigation";

export function useLogin() {
  const setUserData = useAuthStore((s) => s.setUserData);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      companyEmail: string;
      userEmail: string;
      password: string;
    }) => login(data),
    onSuccess: (response) => {
      const user = response?.data?.user || response?.user;
      const role = response?.data?.user?.role || response?.user?.role;

      if (user) {
        setUserData({
          id: user.id,
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          avatarUrl: user.avatarUrl || null,
          role: role || "EMPLOYEE",
        });
      }

      if (role === "EMPLOYEE") {
        router.replace("/profile");
      } else {
        router.replace("/dashboard");
      }
    },
  });
}