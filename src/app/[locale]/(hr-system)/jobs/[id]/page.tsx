"use client";

import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  ChevronRight,
  Loader2,
  MapPin,
  Briefcase,
  CalendarClock,
  Building,
  CheckCircle2,
  Star,
} from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { useJob } from "../hooks/useJobs";
import { cn } from "@/lib/utils";

export default function JobDetailsPage() {
  const { id } = useParams();
  const t = useTranslations("jobs.details");
  const tStatus = useTranslations("jobs.status");
  const locale = useLocale();
  const router = useRouter();

  const { data, isLoading, isError } = useJob(id as string, locale);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="flex h-96 items-center justify-center text-status-error font-bold">
        {t("notFound")}
      </div>
    );
  }

  const job = data.data;

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto pb-10 text-right">
      <div
        className="flex items-center gap-2 text-content-muted text-sm font-bold mb-1 cursor-pointer w-fit"
        onClick={() => router.push("/jobs")}
      >
        <span>{t("breadcrumbs.list")}</span>
        <ChevronRight size={14} className="rtl:rotate-0 ltr:rotate-180" />
        <span className="text-primary">{job.title}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-secondary">
            {job.title}
          </h1>
          <div className="flex items-center gap-3 pt-1">
            <span className="px-2.5 py-1 bg-gray-100 text-content-dark text-xs font-bold rounded-md uppercase tracking-wider">
              {job.jobId}
            </span>
            <span className="text-sm font-bold text-content-muted flex items-center gap-1.5">
              <Building size={16} className="text-primary" /> {job.company}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="text-sm font-medium text-content-muted">
              {job.organization || "---"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-extrabold",
              job.is_active
                ? "bg-status-success/10 text-status-success"
                : "bg-gray-100 text-content-muted",
            )}
          >
            {job.is_active ? tStatus("active") : tStatus("inactive")}
          </span>
          <p className="text-[11px] font-bold text-content-muted uppercase tracking-wider">
            {t("stats.posted")}: {new Date(job.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <MapPin size={22} className="text-[#00FFB9]" />
          <div>
            <p className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider">
              {t("stats.location")}
            </p>
            <p
              className="text-sm font-black text-secondary mt-0.5 truncate"
              title={job.locationDetails}
            >
              {job.locationDetails}
            </p>
            <p className="text-[11px] font-bold text-content-muted mt-0.5">
              {job.country?.name || "---"}
            </p>
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <Briefcase size={22} className="text-[#00FFB9]" />
          <div>
            <p className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider">
              {t("stats.type")}
            </p>
            <p className="text-sm font-black text-secondary mt-0.5 uppercase">
              {job.jobType.replace("-", " ")}
            </p>
            <p className="text-[11px] font-bold text-content-muted mt-0.5 capitalize">
              {job.employmentType}
            </p>
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <Building size={22} className="text-[#00FFB9]" />
          <div>
            <p className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider">
              {t("stats.workMode")}
            </p>
            <p className="text-sm font-black text-secondary mt-0.5 uppercase">
              {job.workMode}
            </p>
            <p className="text-[11px] font-bold text-content-muted mt-0.5">
              {job.duration || "---"}
            </p>
          </div>
        </div>
        <div className="bg-card p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
          <CalendarClock size={22} className="text-[#00FFB9]" />
          <div>
            <p className="text-[10px] font-extrabold text-content-muted uppercase tracking-wider">
              {t("stats.expires")}
            </p>
            <p className="text-sm font-black text-secondary mt-0.5">
              {new Date(job.expirationDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
        <div>
          <h3 className="text-sm font-extrabold text-secondary uppercase tracking-wider mb-3">
            {t("info.description")}
          </h3>
          <p className="text-sm font-medium text-content-dark leading-relaxed">
            {job.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-secondary uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" />{" "}
              {t("info.responsibilities")}
            </h3>
            <ul className="space-y-3">
              {job.responsibilities?.map((res) => (
                <li
                  key={res._id}
                  className="text-sm font-medium text-content flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{res.text}</span>
                </li>
              ))}
              {!job.responsibilities?.length && (
                <p className="text-sm text-content-muted font-medium italic">
                  ---
                </p>
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-secondary uppercase tracking-wider flex items-center gap-2">
              <Star size={16} className="text-status-warning" />{" "}
              {t("info.requirements")}
            </h3>
            <ul className="space-y-3">
              <li className="text-sm font-black text-content-dark bg-gray-50 p-3 rounded-xl border border-gray-100">
                {job.experienceLevel?.title || "---"}
              </li>
              {job.requirements?.map((req) => (
                <li
                  key={req._id}
                  className="text-sm font-medium text-content flex items-start gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-status-warning mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{req.text}</span>
                </li>
              ))}
              {!job.requirements?.length && (
                <p className="text-sm text-content-muted font-medium italic">
                  ---
                </p>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50">
          <h3 className="text-sm font-extrabold text-secondary uppercase tracking-wider mb-4">
            {t("info.classification")}
          </h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 bg-[#ccffef] text-[#000028] border border-[#00FFB9] text-xs font-bold rounded-lg">
              {job.fieldOfWork?.name || "---"}
            </span>
            {job.keywords?.map((kw) => (
              <span
                key={kw._id}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 text-content-muted text-xs font-bold rounded-lg"
              >
                {kw.word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
