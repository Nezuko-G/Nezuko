"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function MyAttendanceRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/attendance");
  }, [router]);

  return null;
}
