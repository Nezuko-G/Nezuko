import { getTranslations } from "next-intl/server";
import { Asset } from "@/types/dto/asset.dto";
import AssetTable from "../../../assets/_components/AssetTable";
import AssetActionModal from "../../../assets/_components/modals/AssetActionModal";

const EMPLOYEE_DUMMY_ASSETS: Asset[] = [
  { id: "2", name: "MacBook Pro", brand: "Apple", category: "Laptop", serialNumber: "SN-MBP1", status: "ASSIGNED", condition: "NEW", currentHolder: { id: "user123", name: "Ahmed Hassan" }, purchaseCost: 2500, purchaseDate: "2024-01-15" },
];

export default async function EmployeeAssetsPage() {
  const t = await getTranslations("assets.views");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-black text-secondary">
          {t("employeeAssets")} <span className="text-primary">— Ahmed Hassan</span>
        </h1>
      </div>

      {EMPLOYEE_DUMMY_ASSETS.length > 0 ? (
        <AssetTable assets={EMPLOYEE_DUMMY_ASSETS} isReadOnly={false} />
      ) : (
        <div className="w-full bg-card border border-gray-100 rounded-2xl p-12 flex items-center justify-center text-content-muted">
          <p className="text-lg font-bold">{t("noAssets")}</p>
        </div>
      )}

      <AssetActionModal />
    </div>
  );
}