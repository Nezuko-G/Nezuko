"use client";

import { useTranslations } from "next-intl";
import { Search, FileText, Plus, Loader2 } from "lucide-react";
import AssetTable from "./_components/AssetTable";
import { Button } from "@/components/ui/button";
import { useAssets } from "@/hooks/useAssets";
import AssetModalsContainer from "./_components/modals/AssetActionModal";
import RoleGuard from "@/components/RoleGuard/RoleGuard";
import { useAssetUIStore } from "@/hooks/useAssetUIStore";


export default function AssetsPage() {
  const t = useTranslations("assets.list");
  const { data: assets, isLoading, isError } = useAssets();
  const { openModal } = useAssetUIStore();
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-secondary">{t("title")}</h1>
        <div className="flex items-center gap-3">
          <RoleGuard allowedRoles={["HR"]}>
            <Button variant="outline" className="gap-2 bg-card border-gray-200 text-content-dark hover:border-primary hover:text-primary">
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

      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder={t("search")}
            className="w-full bg-background border border-gray-200 text-content placeholder:text-content-muted rounded-xl px-10 py-2.5 text-sm focus:outline-none focus:border-primary transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
        </div>
      </div>

      {isLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      ) : isError ? (
        <div className="w-full h-64 flex items-center justify-center text-status-error font-bold">
          Error fetching assets...
        </div>
      ) : (
        <AssetTable assets={assets || []} />
      )}

      <AssetModalsContainer />
    </div>
  );
}