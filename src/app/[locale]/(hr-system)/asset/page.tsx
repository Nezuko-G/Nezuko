"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  FileText,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import AssetTable from "./_components/AssetTable";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/app/[locale]/(hr-system)/asset/hooks/useAssets";
import AssetModalsContainer from "./_components/modals/AssetActionModal";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useAssetUIStore } from "@/app/[locale]/(hr-system)/asset/hooks/useAssetUIStore";

export default function AssetsPage() {
  const t = useTranslations("assets.list");
  const { openModal } = useAssetUIStore();

  // 1. States للبحث والفلترة والصفحات
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // 2. Debounce للبحث (500ms)
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useAssets({
    page,
    search: debouncedSearch,
    status,
  });

  const assets = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-secondary">{t("title")}</h1>
        <div className="flex items-center gap-3">
          <RoleGuard allowedRoles={["HR"]}>
            <Button
              variant="outline"
              className="gap-2 bg-card border-gray-200 text-content-dark hover:border-primary hover:text-primary"
            >
              <FileText size={18} />
              <span className="hidden sm:inline">{t("reportBtn")}</span>
            </Button>
            <Button className="gap-2" onClick={() => openModal("CREATE")}>
              <Plus size={18} />
              <span>{t("registerBtn")}</span>
            </Button>
          </RoleGuard>
        </div>
      </div>

      {/* شريط البحث والفلترة */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-background border border-gray-200 text-content placeholder:text-content-muted rounded-xl px-10 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-content-muted"
            size={18}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-content-muted hidden md:block" />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-48 bg-background border border-gray-200 text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary transition-all cursor-pointer"
          >
            <option value="">{t("status.all")}</option>
            <option value="AVAILABLE">{t("status.AVAILABLE")}</option>
            <option value="ASSIGNED">{t("status.ASSIGNED")}</option>
            <option value="MAINTENANCE">{t("status.MAINTENANCE")}</option>
          </select>
        </div>
      </div>

      {/* منطقة الجدول */}
      <div className="bg-card rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-status-error font-bold">
            {t("errors.fetch")}
          </div>
        ) : (
          <>
            <div className="flex-1">
              <AssetTable assets={assets} />
            </div>

            {/* Pagination Footer */}
            {meta && meta.last_page > 1 && (
              <div className="p-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                <p className="text-sm text-content-muted font-bold">
                  {t("pagination", { current: page, total: meta.last_page })}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-9 w-9 p-0 rounded-lg"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.last_page}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-9 w-9 p-0 rounded-lg"
                  >
                    <ChevronRight size={18} />
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
