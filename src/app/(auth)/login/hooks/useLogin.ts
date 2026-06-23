"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { login } from "../api/auth.api";
import { useAuthStore } from "@/hooks/useAuthStore";
import { fetchImageAsBase64 } from "@/lib/avatar";

export function useLogin() {
  const setRole = useAuthStore((s) => s.setRole);
  const setUserData = useAuthStore((s) => s.setUserData);
  const router = useRouter();

  return useMutation({
    mutationFn: (data: {
      companyEmail: string;
      userEmail: string;
      password: string;
    }) => login(data),
    onSuccess: async (response) => {
      const user = response?.data?.user || response?.user;
      const role = user?.role;

      if (user?.avatarUrl) {
        try {
          const base64 = await fetchImageAsBase64(user.avatarUrl);
          setUserData({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
            avatarBase64: base64,
          });
        } catch {
          setUserData({
            firstName: user.firstName ?? "",
            lastName: user.lastName ?? "",
          });
        }
      } else if (user?.firstName) {
        setUserData({
          firstName: user.firstName,
          lastName: user.lastName ?? "",
        });
      }

      setRole(role || "EMPLOYEE");

      if (role === "EMPLOYEE") {
        router.push("/profile");
      } else {
        router.push("/dashboard");
      }
    },
  });
}
