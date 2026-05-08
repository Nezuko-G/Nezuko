export type AssetStatus = "AVAILABLE" | "ASSIGNED" | "UNDER_MAINTENANCE" | "RETIRED";
export type AssetCondition = "NEW" | "GOOD" | "FAIR" | "POOR" | "DAMAGED";

export interface Employee {
  id: string;
  name: string;
  avatar?: string;
}

export interface Asset {
  id: string;
  name: string;
  brand: string;
  category: string;
  serialNumber: string;
  status: AssetStatus;
  condition: AssetCondition;
  currentHolder?: Employee | null;
  purchaseCost: number;
  purchaseDate: string;
}