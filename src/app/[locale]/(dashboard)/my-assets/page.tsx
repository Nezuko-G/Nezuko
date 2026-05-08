import { getTranslations } from "next-intl/server";
import { Asset } from "@/types/dto/asset.dto";
import AssetTable from "../assets/_components/AssetTable";
import { Laptop } from "lucide-react";

const MY_DUMMY_ASSETS: Asset[] = [
  { id: "1", name: "Dell XPS 15", brand: "Dell", category: "Laptop", serialNumber: "SN-00412", status: "ASSIGNED", condition: "GOOD", currentHolder: { id: "me", name: "Current User" }, purchaseCost: 1800, purchaseDate: "2023-03-01" },
  { id: "3", name: "Logitech MX Keys", brand: "Logitech", category: "Peripheral", serialNumber: "SN-0991", status: "ASSIGNED", condition: "FAIR", currentHolder: { id: "me", name: "Current User" }, purchaseCost: 100, purchaseDate: "2022-05-10" },
];

export default async function MyAssetsPage() {
  const t = await getTranslations("assets.views");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <div className="w-12 h-12 bg-primary-light text-secondary rounded-xl flex items-center justify-center">
          <Laptop size={24} />
        </div>
        <h1 className="text-2xl font-black text-secondary">{t("myAssets")}</h1>
      </div>

      {MY_DUMMY_ASSETS.length > 0 ? (
        <AssetTable assets={MY_DUMMY_ASSETS} isReadOnly={true} />
      ) : (
        <div className="w-full bg-card border border-gray-100 rounded-2xl p-12 flex flex-col items-center justify-center text-content-muted">
          <Laptop size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-bold">{t("noAssets")}</p>
        </div>
      )}
    </div>
  );
}