"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEmployeeAssets } from "@/hooks/useAssets";
import AssetTable from "../../../assets/_components/AssetTable";
import AssetModalsContainer from "../../../assets/_components/modals/AssetActionModal";
import { Loader2 } from "lucide-react";

export default function EmployeeAssetsPage() {
  const { id } = useParams();
  const t = useTranslations("assets.views");
  const { data: assets, isLoading } = useEmployeeAssets(id as string);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-black text-secondary">{t("employeeAssets")}</h1>
      {isLoading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={30} /></div>
      ) : (
        <AssetTable assets={assets || []} isReadOnly={false} />
      )}
      <AssetModalsContainer />
    </div>
  );
}