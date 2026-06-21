"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useJobBilingual, useUpdateJob } from "../../hooks/useJobs";
import JobForm from "../../_components/JobForm";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

export default function EditJobPage() {
  const { id } = useParams();
  const t = useTranslations("jobs.edit");
  const router = useRouter();

  const { data, isLoading, isError } = useJobBilingual(id as string);
  const updateMutation = useUpdateJob();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-96 items-center justify-center text-status-error font-bold">
        {t("notFound")}
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["HR_ADMIN", "TENANT_OWNER"]}>
      <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto p-4">
        <div
          className="flex items-center gap-2 text-content-muted text-sm font-bold mb-1 cursor-pointer w-fit"
          onClick={() => router.push("/jobs")}
        >
          <span>{t("breadcrumbs.list")}</span>
          <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
          <span className="text-primary">{t("title")}</span>
        </div>

        <div className="space-y-0.5 ">
          <h1 className="text-2xl font-extrabold text-secondary">
            {t("title")}
          </h1>
          <p className="text-sm font-medium text-content-muted">
            {data.title?.en}
          </p>
        </div>

        <div className="pt-2">
          <JobForm
            initialData={data as any}
            isPending={updateMutation.isPending}
            onSubmit={(payload) => {
              updateMutation.mutate(
                { id: data._id, data: payload },
                {
                  onSuccess: () => router.push("/jobs"),
                },
              );
            }}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
