import { z } from 'zod';
import apiClient from '@/lib/axios/core/instance';
import { apis } from '../config';
import { 
  AssetDTO, AssetHistoryDTO, DepreciationReportItemDTO,
  CreateAssetDTO, UpdateAssetDTO, 
  AssignAssetDTO, ReturnAssetDTO, TransferAssetDTO 
} from '@/types/dto/asset.dto';
import { 
  mapAssetFromDTO, mapAssetsFromDTO, 
  mapAssetHistoryFromDTO, mapDepreciationReportFromDTO 
} from '@/lib/mappers/asset.mapper';


export async function getAssets(params?: { status?: string, category?: string }) {
    const response = await apiClient.get<{ data: z.infer<typeof AssetDTO>[], meta: any }>(apis.assets.base, { params });
    return mapAssetsFromDTO(response.data.data);
}

export async function getAsset(id: string) {
  const response = await apiClient.get<{ data: any }>(`${apis.assets.base}/${id}`);
  return mapAssetFromDTO(response.data.data); 
}

export async function getMyAssets() {
  const response = await apiClient.get<z.infer<typeof AssetDTO>[]>(apis.assets.me);
  return mapAssetsFromDTO(response.data);
}

export async function getEmployeeAssets(userId: string) {
  const response = await apiClient.get<z.infer<typeof AssetDTO>[]>(apis.assets.employeeAssets(userId));
  return mapAssetsFromDTO(response.data);
}

export async function getAssetHistory(id: string) {
  const response = await apiClient.get<z.infer<typeof AssetHistoryDTO>[]>(apis.assets.history(id));
  return mapAssetHistoryFromDTO(response.data);
}

export async function getDepreciationReport() {
  const response = await apiClient.get<z.infer<typeof DepreciationReportItemDTO>[]>(apis.assets.depreciation);
  return mapDepreciationReportFromDTO(response.data);
}


export async function createAsset(data: z.infer<typeof CreateAssetDTO>) {
  const validated = CreateAssetDTO.parse(data);
  const response = await apiClient.post<z.infer<typeof AssetDTO>>(apis.assets.base, validated);
  return mapAssetFromDTO(response.data);
}

export async function updateAsset({ id, data }: { id: string, data: z.infer<typeof UpdateAssetDTO> }) {
  const validated = UpdateAssetDTO.parse(data);
  const response = await apiClient.patch<z.infer<typeof AssetDTO>>(`${apis.assets.base}/${id}`, validated);
  return mapAssetFromDTO(response.data);
}

export async function assignAsset({ id, data }: { id: string, data: z.infer<typeof AssignAssetDTO> }) {
  const validated = AssignAssetDTO.parse(data);
  const response = await apiClient.post(apis.assets.assign(id), validated);
  return response.data;
}

export async function returnAsset({ id, data }: { id: string, data: z.infer<typeof ReturnAssetDTO> }) {
  const validated = ReturnAssetDTO.parse(data);
  const response = await apiClient.post(apis.assets.return(id), validated);
  return response.data;
}

export async function transferAsset({ id, data }: { id: string, data: z.infer<typeof TransferAssetDTO> }) {
  const validated = TransferAssetDTO.parse(data);
  const response = await apiClient.post(apis.assets.transfer(id), validated);
  return response.data;
}