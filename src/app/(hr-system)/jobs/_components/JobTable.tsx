"use client";

import { useTranslations } from "next-intl";
import { JobResponse } from "../types/job.dto";
import { Pencil, Trash2, Power, PowerOff } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useDeleteJob, useToggleJobStatus } from "../hooks/useJobs";
import { cn } from "@/lib/utils";

interface JobTableProps {
  jobs: JobResponse[];
}

export default function JobTable({ jobs }: JobTableProps) {
  const t = useTranslations("jobs.list.table");
  const tStatus = useTranslations("jobs.status");
  const router = useRouter();
  const deleteMutation = useDeleteJob();
  const toggleMutation = useToggleJobStatus();

  return (
    <table className="w-full text-sm text-right border-gray-100 bg-card border-collapse">
      <thead>
        <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
          <th className="px-6 py-4 text-right">{t("title")}</th>
          <th className="px-6 py-4 text-right">{t("company")}</th>
          <th className="px-6 py-4 text-center">{t("jobType")}</th>
          <th className="px-6 py-4 text-center">{t("status")}</th>
          <th className="px-6 py-4 text-left ps-8">{t("actions")}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {jobs.map((job) => (
          <tr
            key={job._id}
            onClick={() => router.push(`/jobs/${job._id}`)}
            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors cursor-pointer group"
          >
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <p className="font-semibold text-secondary group-hover:text-primary transition-colors">
                  {job.title}
                </p>
                <p className="text-xs text-content-muted font-medium mt-0.5">
                  {job.jobId}
                </p>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="font-semibold text-secondary">
                {job.company}
              </span>
            </td>
            <td className="px-6 py-4 text-center">
              <span className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-md text-xs font-bold text-secondary uppercase">
                {job.jobType.replace("-", " ")}
              </span>
            </td>
            <td className="px-6 py-4 text-center">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold",
                  job.is_active
                    ? "bg-status-success/10 text-status-success"
                    : "bg-gray-100 text-content-muted",
                )}
              >
                {job.is_active ? tStatus("active") : tStatus("inactive")}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-end gap-2 ps-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMutation.mutate(job._id);
                  }}
                  disabled={toggleMutation.isPending}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    job.is_active
                      ? "hover:bg-status-warning/10 text-content-muted hover:text-status-warning"
                      : "hover:bg-status-success/10 text-content-muted hover:text-status-success",
                  )}
                  title={t("toggle")}
                >
                  {job.is_active ? <PowerOff size={15} /> : <Power size={15} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/jobs/${job._id}/edit`);
                  }}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-content-muted hover:text-secondary transition-colors"
                  title={t("edit")}
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(job._id);
                  }}
                  disabled={deleteMutation.isPending}
                  className="p-1.5 rounded-lg hover:bg-status-error/10 text-content-muted hover:text-status-error transition-colors"
                  title={t("delete")}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </td>
          </tr>
        ))}
        {jobs.length === 0 && (
          <tr>
            <td
              colSpan={5}
              className="text-center py-16 font-bold text-content-muted"
            >
              {t("empty")}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
