"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  FileText,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Briefcase,
} from "lucide-react";
import AssetTable from "./_components/AssetTable";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/app/[locale]/(hr-system)/asset/hooks/useAssets";
import AssetModalsContainer from "./_components/modals/AssetModalsContainer";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useAssetUIStore } from "@/app/[locale]/(hr-system)/asset/hooks/useAssetUIStore";
import { useRouter } from "@/i18n/navigation";

export default function AssetsPage() {
  const t = useTranslations("assets.list");
  const { openModal } = useAssetUIStore();
  const router = useRouter();

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useAssets({
    page,
    limit,
    status,
  });

  const assetsList = data?.data || [];
  const meta = data?.meta;
  const lastPage = meta?.totalPages || 1;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-8 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl flex font-black text-secondary tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm flex font-medium text-content-muted">
            {t("subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 bg-background border-gray-200 text-secondary hover:border-secondary hover:bg-secondary/5 shadow-sm transition-all font-bold"
            onClick={() => router.push("/asset/me")}
          >
            <Briefcase size={18} />
            <span className="hidden sm:inline">{t("myAssetsBtn")}</span>
          </Button>

          <RoleGuard allowedRoles={["HR"]}>
            <Button
              variant="outline"
              className="gap-2 bg-background border-gray-200 text-content-dark hover:border-primary hover:text-primary shadow-sm transition-all font-bold"
              onClick={() => router.push("/asset/report")}
            >
              <FileText size={18} />
              <span className="hidden sm:inline">{t("reportBtn")}</span>
            </Button>
            <Button
              className="gap-2 shadow-md font-bold transition-all"
              onClick={() => openModal("CREATE")}
            >
              <Plus size={18} />
              <span>{t("registerBtn")}</span>
            </Button>
          </RoleGuard>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-3 rounded-2xl shadow-sm border border-gray-100 w-full md:w-fit">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 shrink-0">
          <Filter size={18} className="text-gray-500" />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-56 bg-transparent text-content-dark text-sm font-bold focus:outline-none cursor-pointer appearance-none px-2"
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

      <div className="bg-card rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-sm font-bold text-content-muted animate-pulse">
              {t("loading")}
            </p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-status-error font-bold">
            {t("errors.fetch")}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-x-auto">
              <AssetTable assets={assetsList} />
            </div>

            {lastPage > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-center gap-5 bg-gray-50/50">
                <p className="text-sm text-content-muted font-bold">
                  {t("pagination", { current: page, total: lastPage })}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-9 w-9 p-0 rounded-xl bg-background border-gray-200 hover:bg-gray-100 text-content-dark transition-all disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-9 w-9 p-0 rounded-xl bg-background border-gray-200 hover:bg-gray-100 text-content-dark transition-all disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </Button>
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
