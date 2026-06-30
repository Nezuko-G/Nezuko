import { z } from "zod";

export const AssetStatusEnum = z.enum(["AVAILABLE", "ASSIGNED", "UNDER_MAINTENANCE", "RETIRED"]);
export const AssetConditionEnum = z.enum(["NEW", "GOOD", "FAIR", "POOR", "DAMAGED"]);

export const AssetDTO = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  model: z.string().nullable().optional(), 
  serialNumber: z.string().nullable().optional(),
  status: AssetStatusEnum,
  condition: AssetConditionEnum,
  purchaseCost: z.number(),
  purchaseDate: z.string(),
  notes: z.string().nullable().optional(),
  currentHolder: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable().optional()
});
export type Asset = z.infer<typeof AssetDTO>;

export const AssetHistoryDTO = z.object({
  id: z.string(),
  type: z.enum(["ASSIGN", "RETURN"]),
  employeeName: z.string(),
  date: z.string(),
  performedBy: z.string(),
  conditionOut: AssetConditionEnum.nullable().optional(),
  conditionIn: AssetConditionEnum.nullable().optional(),
  downgradeFlag: z.boolean(),
});

export const DepreciationReportItemDTO = z.object({
  id: z.string(),
  name: z.string(),
  serialNumber: z.string().nullable().optional(),
  purchaseCost: z.number(),
  purchaseDate: z.string(),
  elapsedYears: z.number(), 
  currentBookValue: z.number(), 
});

export type DepreciationItem = z.infer<typeof DepreciationReportItemDTO> & {
  depreciationPercentage: number;
  isFullyDepreciated: boolean;
};

export const AssignAssetDTO = z.object({
  userId: z.string().min(1),
  conditionOut: AssetConditionEnum,
  notes: z.string().optional(),
});

export const ReturnAssetDTO = z.object({
  conditionIn: AssetConditionEnum,
  notes: z.string().optional(),
});

export const TransferAssetDTO = z.object({
  toUserId: z.string().min(1),
  conditionOut: AssetConditionEnum,
  notes: z.string().optional(),
});

export const CreateAssetDTO = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  model: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  condition: AssetConditionEnum,
  purchaseCost: z.number().positive(),
  purchaseDate: z.string(),
  notes: z.string().optional().nullable(),
});

export const UpdateAssetDTO = CreateAssetDTO.partial();
