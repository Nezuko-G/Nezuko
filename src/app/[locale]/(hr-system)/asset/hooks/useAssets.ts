"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getAssets, getAsset, getAssetHistory, getDepreciationReport,
  createAsset, updateAsset, assignAsset, returnAsset, transferAsset, 
  getEmployeeAssets,
  getMyAssets
} from "@/lib/api/endpoints/assets";
import { useAssetUIStore } from "./useAssetUIStore";


export function useAssets(filters: { 
  page?: number; 
  search?: string; 
  status?: string; 
  category?: string 
}) {
  return useQuery({
    queryKey: ['assets', filters], 
    queryFn: () => getAssets(filters),
  });
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: ["asset", id],
    queryFn: () => getAsset(id),
    enabled: !!id,
  });
}

export function useAssetHistory(id: string) {
  return useQuery({
    queryKey: ["asset-history", id],
    queryFn: () => getAssetHistory(id),
    enabled: !!id,
  });
}

export function useDepreciationReport() {
  return useQuery({
    queryKey: ["depreciation-report"],
    queryFn: getDepreciationReport,
  });
}

export function useMyAssets() {
  return useQuery({
    queryKey: ["asset", "me"],
    queryFn: getMyAssets,
  });
}

export function useEmployeeAssets(userId: string) {
  return useQuery({
    queryKey: ["asset", "employee", userId],
    queryFn: () => getEmployeeAssets(userId),
    enabled: !!userId,
  });
}


export function useAssetMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useAssetUIStore();

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ["asset"] });
    queryClient.invalidateQueries({ queryKey: ["asset-history"] });
    closeModal(); 
  };

  const assignMutation = useMutation({
    mutationFn: assignAsset,
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      
      queryClient.invalidateQueries({ queryKey: ['asset', variables.id] });
      
      queryClient.invalidateQueries({ queryKey: ['asset-history', variables.id] });
      
      closeModal();
    },
  });

  const returnMutation = useMutation({
    mutationFn: returnAsset,
    onSuccess: onSuccessAction,
  });

  const transferMutation = useMutation({
    mutationFn: transferAsset,
    onSuccess: onSuccessAction,
  });

  const createMutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAsset,
    onSuccess: onSuccessAction,
  });

  

  return {
    assignAsset: assignMutation,
    returnAsset: returnMutation,
    transferAsset: transferMutation,
    createAsset: createMutation,
    updateAsset: updateMutation,
    getEmployeeAssets: useEmployeeAssets,
    getMyAssets: useMyAssets,
    isLoading: 
      assignMutation.isPending || 
      returnMutation.isPending || 
      transferMutation.isPending || 
      createMutation.isPending || 
      updateMutation.isPending
  };
}