"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  FileText,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import AssetTable from "./_components/AssetTable";
import { useAssets } from "@/app/[locale]/(hr-system)/asset/hooks/useAssets";
import AssetModalsContainer from "./_components/modals/AssetModalsContainer";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useAssetUIStore } from "@/app/[locale]/(hr-system)/asset/hooks/useAssetUIStore";
import { useRouter } from "@/i18n/navigation";
import { useDepartments } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartments";

export default function AssetsPage() {
  const t = useTranslations("assets.list");
  const { openModal } = useAssetUIStore();
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useAssets({
    page,
    limit,
    status,
    search: search || undefined,
  });

  const { data: departmentsData } = useDepartments({});
  const departments = departmentsData?.data || [];

  const assetsList = data?.data || [];
  const meta = data?.meta;
  const lastPage = meta?.totalPages || 1;

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 md:p-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-secondary">{t("title")}</h1>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => router.push("/asset/me")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-card text-secondary font-bold text-sm shadow-sm hover:bg-gray-50 transition"
          >
            <Briefcase size={16} />
            <span>{t("myAssetsBtn")}</span>
          </button>

          <RoleGuard allowedRoles={["HR_ADMIN"]}>
            <button
              onClick={() => router.push("/asset/report")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-card text-content hover:text-primary transition font-bold text-sm shadow-sm"
            >
              <FileText size={16} />
              <span>{t("reportBtn")}</span>
            </button>
            <button
              onClick={() => openModal("CREATE")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-secondary font-bold text-sm shadow hover:opacity-90 transition"
            >
              <Plus size={16} />
              <span>{t("registerBtn")}</span>
            </button>
          </RoleGuard>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-semibold placeholder:text-content-muted placeholder:font-normal"
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm font-semibold focus:outline-none cursor-pointer"
        >
          <option value="">{t("status.all")}</option>
          <option value="AVAILABLE">{t("status.AVAILABLE")}</option>
          <option value="ASSIGNED">{t("status.ASSIGNED")}</option>
          <option value="UNDER_MAINTENANCE">
            {t("status.UNDER_MAINTENANCE")}
          </option>
          <option value="RETIRED">{t("status.RETIRED")}</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-[400px]">
            <Loader2 className="animate-spin text-primary" size={36} />
            <p className="text-sm font-bold text-content-muted animate-pulse">
              {t("loading")}
            </p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-status-error font-bold min-h-[200px]">
            {t("errors.fetch")}
          </div>
        ) : (
          <>
            <div className="flex-1">
              <AssetTable assets={assetsList} />
            </div>

            {lastPage > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-center gap-4 bg-gray-50/50">
                <p className="text-sm text-content-muted font-bold">
                  {t("pagination", { current: page, total: lastPage })}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AssetModalsContainer />
    </div>
  );
}
