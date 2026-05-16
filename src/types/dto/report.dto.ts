import { z } from "zod";

export const ReportTypeDTO = z.object({
  key: z.string(),
  description: z.string(),
  supportedFilters: z.array(z.string()),
});

export type ReportType = z.infer<typeof ReportTypeDTO>;

export const ReportPreviewMetaDTO = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const ReportPreviewDTO = z.object({
  type: z.string(),
  data: z.array(z.record(z.any())),
  meta: ReportPreviewMetaDTO,
});

export type ReportPreview = z.infer<typeof ReportPreviewDTO>;

export const ReportHistoryItemDTO = z.object({
  type: z.string(),
  generatedBy: z.any().nullable().optional(),
  generatedAt: z.string(),
  format: z.string(),
  fileName: z.string(),
  downloadUrl: z.string(),
  filters: z.record(z.any()).optional(),
});

export type ReportHistoryItem = z.infer<typeof ReportHistoryItemDTO>;