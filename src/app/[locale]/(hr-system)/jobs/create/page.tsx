"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useCreateJob } from "../hooks/useJobs";
import JobForm from "../_components/JobForm";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

export default function CreateJobPage() {
  const t = useTranslations("jobs.create");
  const router = useRouter();
  const createMutation = useCreateJob();

  return (
    <RoleGuard allowedRoles={["HR", "TENANT_OWNER"]}>
      <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto pb-10 text-right">
        <div
          className="flex items-center gap-2 text-content-muted text-sm font-bold mb-1 cursor-pointer w-fit"
          onClick={() => router.push("/jobs")}
        >
          <span>{t("breadcrumbs.list")}</span>
          <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
          <span className="text-primary">{t("title")}</span>
        </div>

        <div className="space-y-0.5">
          <h1 className="text-2xl font-extrabold text-secondary">
            {t("title")}
          </h1>
          <p className="text-sm font-medium text-content-muted">
            {t("subtitle")}
          </p>
        </div>

        <div className="pt-2">
          <JobForm
            isPending={createMutation.isPending}
            onSubmit={(data) => {
              createMutation.mutate(data, {
                onSuccess: () => router.push("/jobs"),
              });
            }}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
