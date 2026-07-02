"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useTranslations } from "next-intl";
import { FileText, Plus, Loader2, Briefcase } from "lucide-react";
import AssetTable from "./_components/AssetTable";
import { useAssets } from "@/app/(hr-system)/asset/hooks/useAssets";
import AssetModalsContainer from "./_components/modals/AssetModalsContainer";
import { Pagination } from "@/app/(hr-system)/_components/Pagination";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useAssetUIStore } from "@/app/(hr-system)/asset/hooks/useAssetUIStore";
import { useRouter } from "@/i18n/navigation";

export default function AssetsPage() {
  const t = useTranslations("assets.list");
  const { openModal } = useAssetUIStore();
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useAssets({
    page,
    limit,
    status,
    search: debouncedSearch || undefined,
  });

  const assetsList = data?.data || [];
  const meta = data?.meta;
  const lastPage = meta?.totalPages || 1;

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-secondary">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-content-muted">{t("subtitle")}</p>
        </div>
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
          </>
        )}
      </div>

      {!isLoading && assetsList.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={lastPage}
          onPageChange={setPage}
          label={t("pagination", { current: page, total: lastPage })}
        />
      )}

      <AssetModalsContainer />
    </div>
  );
}
