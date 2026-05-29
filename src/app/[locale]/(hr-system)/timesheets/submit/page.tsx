"use client";

import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { SubmitTimesheetForm } from "@/app/[locale]/(hr-system)/timesheets/_components/SubmitTimesheetForm";
import { useRouter } from "@/i18n/navigation";

export default function SubmitTimesheetPage() {
  const router = useRouter();

  return (
    <RoleGuard allowedRoles={["HR_ADMIN"]}>
      <SubmitTimesheetForm onClose={() => router.push("/timesheets")} />
    </RoleGuard>
  );
}
