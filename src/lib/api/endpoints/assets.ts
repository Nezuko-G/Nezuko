"use client";

import { z } from 'zod';
import apiClient from '@/lib/axios/core/instance';
import { apis } from '../config';
import { 
  AssetDTO, AssetHistoryDTO,
  CreateAssetDTO, UpdateAssetDTO, 
  AssignAssetDTO, ReturnAssetDTO, TransferAssetDTO 
} from '@/types/dto/asset.dto';
import { 
  mapAssetFromDTO, mapAssetsFromDTO, 
  mapAssetHistoryFromDTO, mapDepreciationReport
} from '@/lib/mappers/asset.mapper';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: any;
}

export async function getAssets(params?: { status?: string, category?: string, page?: number, limit?: number, search?: string }) {
  const response = await apiClient.get<ApiResponse<z.infer<typeof AssetDTO>[]>>(apis.assets.base, { params });
  
  return {
    data: mapAssetsFromDTO(response.data.data), 
    meta: response.data.meta 
  };
}

export async function getAsset(id: string) {
  const response = await apiClient.get<ApiResponse<z.infer<typeof AssetDTO>>>(`${apis.assets.base}/${id}`);
  return mapAssetFromDTO(response.data.data); 
}

export async function getMyAssets() {
  const response = await apiClient.get<ApiResponse<z.infer<typeof AssetDTO>[]>>(apis.assets.me);
  return mapAssetsFromDTO(response.data.data); 
}

export async function getEmployeeAssets(userId: string) {
  const response = await apiClient.get<ApiResponse<z.infer<typeof AssetDTO>[]>>(apis.assets.employeeAssets(userId));
  return mapAssetsFromDTO(response.data.data); 
}

export async function getAssetHistory(id: string) {
  const response = await apiClient.get(apis.assets.history(id));
  return mapAssetHistoryFromDTO(response.data.data); 
}

export async function getDepreciationReport() {
  const response = await apiClient.get<ApiResponse<any[]>>(apis.assets.depreciation);
  return mapDepreciationReport(response.data.data); 
}

export async function createAsset(data: z.infer<typeof CreateAssetDTO>) {
  const validated = CreateAssetDTO.parse(data);
  const response = await apiClient.post<ApiResponse<z.infer<typeof AssetDTO>>>(apis.assets.base, validated);
  return mapAssetFromDTO(response.data.data); 
}

export async function updateAsset({ id, data }: { id: string, data: z.infer<typeof UpdateAssetDTO> }) {
  const validated = UpdateAssetDTO.parse(data);
  const response = await apiClient.patch<ApiResponse<z.infer<typeof AssetDTO>>>(`${apis.assets.base}/${id}`, validated);
  return mapAssetFromDTO(response.data.data);
}

export async function assignAsset({ id, data }: { id: string, data: z.infer<typeof AssignAssetDTO> }) {
   const validatedData = AssignAssetDTO.parse(data);
   return await apiClient.post(apis.assets.assign(id), validatedData);
}

export async function returnAsset({ id, data }: { id: string, data: z.infer<typeof ReturnAssetDTO> }) {
  const validated = ReturnAssetDTO.parse(data);
  const response = await apiClient.post<ApiResponse<any>>(apis.assets.return(id), validated);
  return response.data;
}

export async function transferAsset({ id, data }: { id: string, data: z.infer<typeof TransferAssetDTO> }) {
  const validated = TransferAssetDTO.parse(data);
  const response = await apiClient.post<ApiResponse<any>>(apis.assets.transfer(id), validated);
  return response.data;
}