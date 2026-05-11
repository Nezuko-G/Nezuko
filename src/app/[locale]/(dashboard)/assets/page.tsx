import { getTranslations } from "next-intl/server";
import { Search, FileText, Plus } from "lucide-react";
import AssetTable from "./_components/AssetTable";
import { Asset } from "@/types/dto/asset.dto";
import { Button } from "@/components/ui/button";
import AssetActionModal from "./_components/modals/AssetActionModal";
import RoleGuard from "@/components/RoleGuard/RoleGuard";

const DUMMY_ASSETS: Asset[] = [
  { id: "1", name: "Dell XPS 15", brand: "Dell", category: "Laptop", serialNumber: "SN-00412", status: "ASSIGNED", condition: "GOOD", currentHolder: { id: "e1", name: "Ahmed H." }, purchaseCost: 1800, purchaseDate: "2023-03-01" },
  { id: "2", name: "iPhone 14 Pro", brand: "Apple", category: "Mobile", serialNumber: "SN-00891", status: "AVAILABLE", condition: "NEW", purchaseCost: 999, purchaseDate: "2024-01-15" },
  { id: "3", name: "Logitech MX Keys", brand: "Logitech", category: "Peripheral", serialNumber: "", status: "UNDER_MAINTENANCE", condition: "FAIR", purchaseCost: 100, purchaseDate: "2022-05-10" },
  { id: "4", name: "Old ThinkPad", brand: "Lenovo", category: "Laptop", serialNumber: "SN-00099", status: "RETIRED", condition: "DAMAGED", purchaseCost: 1200, purchaseDate: "2019-02-01" },
];

export default async function AssetsPage() {
  const t = await getTranslations("assets.list");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-secondary">{t("title")}</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
          <RoleGuard allowedRoles={["HR"]}>
            <Button variant="outline" className="gap-2 bg-card border-gray-200 text-content-dark hover:border-primary hover:text-primary">
              <FileText size={18} />
              <span className="hidden sm:inline">{t("reportBtn")}</span>
            </Button>
            <Button className="gap-2">
              <Plus size={18} />
              <span>{t("registerBtn")}</span>
            </Button>
          </RoleGuard>
        </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder={t("search")}
            className="w-full bg-background border border-gray-200 text-content placeholder:text-content-muted rounded-xl px-10 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted" size={18} />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="bg-background border border-gray-200 text-content rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary w-full md:w-40">
            <option>Status: All</option>
          </select>
          <select className="bg-background border border-gray-200 text-content rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary w-full md:w-40">
            <option>Category: All</option>
          </select>
        </div>
      </div>

      <AssetTable assets={DUMMY_ASSETS} />
      <AssetActionModal />
    </div>
  );
}