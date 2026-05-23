"use client";

import { useTranslations } from "next-intl";
import { useMyAssets } from "@/app/[locale]/(hr-system)/asset/hooks/useAssets";
import AssetTable from "../_components/AssetTable";
import { Loader2 } from "lucide-react";

export default function MyAssetsPage() {
  const t = useTranslations("assets.views");
  const { data: assets, isLoading } = useMyAssets();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-4 md:p-8 ">
      <h1 className="text-2xl font-black text-secondary">{t("myAssets")}</h1>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={30} />
        </div>
      ) : (
        <AssetTable assets={assets || []} isReadOnly={true} />
      )}
    </div>
  );
}
