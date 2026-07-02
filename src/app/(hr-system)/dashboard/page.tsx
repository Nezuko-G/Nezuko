"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "./hooks/useDashboard";
import { useAuthStore } from "@/hooks/useAuthStore";
import DashboardClient from "./components/dashboard";
import DashboardSkeleton from "./components/dashboardSkeleton";

export default function Page() {
  const router = useRouter();
  const { role } = useAuthStore();
  const { data, isLoading, isError } = useDashboard();

  useEffect(() => {
    if (role === "EMPLOYEE") {
      router.replace("/profile");
    }
  }, [role, router]);

  if (role === "EMPLOYEE") return <DashboardSkeleton />;
  if (isLoading) return <DashboardSkeleton />;
  if (isError) return <div className="flex items-center justify-center min-h-screen text-status-error font-bold">Failed to load dashboard</div>;

  return <DashboardClient data={data!} />;
}
