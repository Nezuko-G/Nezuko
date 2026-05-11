import { getTranslations } from "next-intl/server";
import { Asset, AssetCondition } from "@/types/dto/asset.dto";
import AssetDetailActions from "./_components/AssetDetailActions";
import AssetActionModal from "../_components/modals/AssetActionModal";

interface HistoryRecord {
  id: string;
  type: "ASSIGN" | "RETURN";
  employeeName: string;
  date: string;
  performedBy: string;
  conditionOut?: AssetCondition;
  conditionIn?: AssetCondition;
  downgradeFlag: boolean;
}

const DUMMY_ASSET: Asset = {
  id: "1",
  name: "Dell XPS 15",
  brand: "Dell XPS 15 9520",
  category: "Laptop",
  serialNumber: "SN-00412",
  status: "ASSIGNED",
  condition: "GOOD",
  currentHolder: { id: "e1", name: "Ahmed Hassan" },
  purchaseCost: 1800,
  purchaseDate: "2023-03-05",
};

const DUMMY_HISTORY: HistoryRecord[] = [
  { id: "h1", type: "ASSIGN", employeeName: "Ahmed H.", date: "2025-04-10", performedBy: "Mona K. (HR Admin)", conditionOut: "GOOD", downgradeFlag: false },
  { id: "h2", type: "RETURN", employeeName: "Sara R.", date: "2025-04-09", performedBy: "System", conditionOut: "GOOD", conditionIn: "FAIR", downgradeFlag: true },
  { id: "h3", type: "ASSIGN", employeeName: "Sara R.", date: "2025-01-15", performedBy: "Mona K. (HR Admin)", conditionOut: "GOOD", downgradeFlag: false },
];

function calculateBookValue(purchaseCost: number, purchaseDate: string) {
  const purchaseYear = new Date(purchaseDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const elapsedYears = Math.max(0, currentYear - purchaseYear);
  const depreciationPerYear = purchaseCost / 5;
  const bookValue = purchaseCost - (depreciationPerYear * elapsedYears);
  return Math.max(0, bookValue);
}

export default async function AssetDetailPage() {
  const tList = await getTranslations("assets.list");
  const tDetails = await getTranslations("assets.details");

  const bookValue = calculateBookValue(DUMMY_ASSET.purchaseCost, DUMMY_ASSET.purchaseDate);
  const totalCustodies = DUMMY_HISTORY.filter(h => h.type === "ASSIGN").length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-content-muted">
            <span>{tList("title")}</span>
            <span>›</span>
            <span>{DUMMY_ASSET.name}</span>
          </div>
          <h1 className="text-2xl font-black text-secondary">{DUMMY_ASSET.name}</h1>
        </div>
        <AssetDetailActions asset={DUMMY_ASSET} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tDetails("purchaseCost")}</p>
          <p className="text-2xl font-black text-content-dark">{tDetails("currency")}{DUMMY_ASSET.purchaseCost.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tDetails("bookValue")}</p>
          <p className="text-2xl font-black text-content-dark">{tDetails("currency")}{bookValue.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-bold text-content-muted mb-2">{tDetails("custodies")}</p>
          <p className="text-2xl font-black text-content-dark">{totalCustodies}</p>
        </div>
        <div className="bg-card border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-content-muted mb-2">{tDetails("status")}</p>
          <div>
            <span className="px-3 py-1 bg-primary-light text-secondary-hover rounded-full text-sm font-bold">
              {tList(`status.${DUMMY_ASSET.status}`)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
            <span className="text-sm font-bold text-content-muted">{tDetails("brandModel")}</span>
            <span className="sm:col-span-2 text-sm font-medium text-content-dark">{DUMMY_ASSET.brand}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
            <span className="text-sm font-bold text-content-muted">{tDetails("serialNumber")}</span>
            <span className="sm:col-span-2 text-sm font-mono text-content-dark">{DUMMY_ASSET.serialNumber}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
            <span className="text-sm font-bold text-content-muted">{tDetails("category")}</span>
            <span className="sm:col-span-2 text-sm font-medium text-content-dark">{DUMMY_ASSET.category}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
            <span className="text-sm font-bold text-content-muted">{tDetails("condition")}</span>
            <div className="sm:col-span-2">
              <span className="px-2 py-1 bg-status-success text-white rounded-md text-xs font-bold">
                {tList(`condition.${DUMMY_ASSET.condition}`)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
            <span className="text-sm font-bold text-content-muted">{tDetails("currentHolder")}</span>
            <div className="sm:col-span-2">
              {DUMMY_ASSET.currentHolder ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center text-xs font-bold">
                    {DUMMY_ASSET.currentHolder.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-content-dark">{DUMMY_ASSET.currentHolder.name}</span>
                </div>
              ) : (
                <span className="text-sm text-content-muted">{tDetails("unassigned")}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
            <span className="text-sm font-bold text-content-muted">{tDetails("purchaseDate")}</span>
            <span className="sm:col-span-2 text-sm font-medium text-content-dark">{DUMMY_ASSET.purchaseDate}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
            <span className="text-sm font-bold text-content-muted">{tDetails("notes")}</span>
            <span className="sm:col-span-2 text-sm font-medium text-content-dark">{tDetails("noNotes")}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-content-dark px-1">{tDetails("historyTitle")}</h2>
        <div className="space-y-3">
          {DUMMY_HISTORY.map((record) => (
            <div key={record.id} className="relative bg-card border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="absolute right-0 top-0 bottom-0 w-1 rounded-r-2xl bg-gray-200">
                <div className={`absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-full border-2 border-card ${record.type === "ASSIGN" ? "bg-status-success" : "bg-blue-500"}`} />
              </div>

              <div className="pr-4">
                <p className="text-sm font-bold text-content-dark mb-1">
                  {record.type === "ASSIGN" 
                    ? tDetails("assignedTo", { name: record.employeeName })
                    : tDetails("returnedFrom", { name: record.employeeName })}
                </p>
                <p className="text-xs text-content-muted flex items-center gap-1">
                  <span>{record.date}</span>
                  <span>·</span>
                  <span>{tDetails("by", { name: record.performedBy })}</span>
                </p>
                {record.downgradeFlag && (
                  <p className="text-xs font-bold text-status-error mt-2">
                    {tDetails("conditionDowngrade")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {record.conditionOut && (
                  <span className="px-3 py-1 bg-background border border-gray-200 text-content-dark rounded-full text-xs font-bold">
                    {tDetails("out", { condition: tList(`condition.${record.conditionOut}`) })}
                  </span>
                )}
                {record.conditionIn && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.downgradeFlag ? "bg-status-warning/10 text-status-warning border border-status-warning/20" : "bg-background border border-gray-200 text-content-dark"}`}>
                    {tDetails("in", { condition: tList(`condition.${record.conditionIn}`) })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

        <AssetActionModal />
    </div>
  );
}