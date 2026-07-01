"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth.api";
import { useAuthStore } from "@/hooks/useAuthStore";

export function useLogin() {
  const setUserData = useAuthStore((s) => s.setUserData);

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
        window.location.href = "/profile";
      } else {
        window.location.href = "/dashboard";
      }
    },
  });
}