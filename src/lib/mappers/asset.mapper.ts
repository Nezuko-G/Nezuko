import { z } from "zod";
import { AssetDTO, DepreciationItem } from "@/types/dto/asset.dto";

export const mapAssetFromDTO = (dto: z.infer<typeof AssetDTO>) => {
  return {
    id: String(dto.id),
    name: dto.name,
    brand: dto.brand,
    category: dto.category,
    serialNumber: dto.serialNumber || "", 
    status: dto.status,
    model: dto.model || "",
    condition: dto.condition,
    currentHolder: dto.currentHolder || null,
    purchaseCost: Number(dto.purchaseCost),
    purchaseDate: dto.purchaseDate,
    notes: dto.notes || "",
  };
};

export const mapAssetsFromDTO = (dtos: z.infer<typeof AssetDTO>[]) => {
  return dtos.map(mapAssetFromDTO);
};

export const mapAssetHistoryFromDTO = (data: any[]) => {
  return data.map(item => ({
    id: item.id,
    date: item.assignedAt, 
    userName: `${item.user?.firstName || ""} ${item.user?.lastName || ""}`.trim(), 
    adminName: `${item.assignedByUser?.firstName || ""} ${item.assignedByUser?.lastName || ""}`.trim(),
    action: item.returnedAt ? "RETURN" : "ASSIGN",
    conditionIn: item.conditionIn,
    conditionOut: item.conditionOut,
    returnedAt: item.returnedAt,
    notes: item.notes
  }));
};

export const mapDepreciationReport = (data: any[]): DepreciationItem[] => {
  return data.map((item) => {
    const totalDepreciation = item.purchaseCost - item.currentBookValue;
    const percentage = (totalDepreciation / item.purchaseCost) * 100;
    
    return {
      ...item,
      depreciationPercentage: Math.min(Math.round(percentage), 100),
      isFullyDepreciated: item.currentBookValue <= 1, 
    };
  });
};