import { z } from "zod";
import { AssetDTO, AssetHistoryDTO, DepreciationReportItemDTO } from "@/types/dto/asset.dto";

export const mapAssetFromDTO = (dto: z.infer<typeof AssetDTO>) => {
  return {
    id: String(dto.id),
    name: dto.name,
    brand: dto.brand,
    category: dto.category,
    serialNumber: dto.serialNumber || "", 
    status: dto.status,
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
    userName: `${item.user?.firstName} ${item.user?.lastName}`, 
    adminName: `${item.assignedByUser?.firstName} ${item.assignedByUser?.lastName}`,
    action: item.returnedAt ? "RETURN" : "ASSIGN", 
    notes: item.notes
  }));
};

export const mapDepreciationReportFromDTO = (dtos: z.infer<typeof DepreciationReportItemDTO>[]) => {
  return dtos.map(dto => ({
    ...dto,
    id: String(dto.id),
  }));
};