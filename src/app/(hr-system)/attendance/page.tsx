"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import TimesheetsPage from "./_components/TimesheetsPage";
import MyAttendancePage from "./_components/MyAttendancePage";

export default function AttendancePage() {
  const { role } = useAuthStore();

  if (role === "EMPLOYEE") {
    return <MyAttendancePage />;
  }

  return <TimesheetsPage />;
}
