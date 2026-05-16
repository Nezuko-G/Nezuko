"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompanyInfo,
  updateCompanyInfo,
  uploadLogo,
  deleteLogo,
  getGeneralSettings,
  updateGeneralSettings,
  getAttendanceSettings,
  updateAttendanceSettings,
} from "../api/company.api";
import type {
  UpdateCompanyInfoRequest,
  UpdateGeneralSettingsRequest,
  UpdateAttendanceSettingsRequest,
} from "../types/company.dto";
import { useToast } from "@/components/ui/toast";

interface ApiErrorType extends Error {
  status?: number;
}

const COMPANY_INFO_KEY = ["company-info"] as const;
const COMPANY_SETTINGS_KEY = ["company-settings"] as const;
const COMPANY_ATTENDANCE_KEY = ["company-attendance"] as const;

export function useCompanyInfo() {
  const toast = useToast();

  return useQuery({
    queryKey: COMPANY_INFO_KEY,
    queryFn: async () => {
      try {
        return await getCompanyInfo();
      } catch (error) {
        const err = error as ApiErrorType;
        toast.error(err?.message || "Failed to load company info");
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateCompanyInfo() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCompanyInfoRequest) => updateCompanyInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_INFO_KEY });
      toast.success("Company info updated successfully");
    },
    onError: (error: ApiErrorType) => {
      toast.error(error?.message || "Failed to update company info");
    },
  });
}

export function useUploadLogo() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_INFO_KEY });
      toast.success("Logo uploaded successfully");
    },
    onError: (error: ApiErrorType) => {
      toast.error(error?.message || "Failed to upload logo");
    },
  });
}

export function useDeleteLogo() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteLogo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_INFO_KEY });
      toast.success("Logo removed successfully");
    },
    onError: (error: ApiErrorType) => {
      toast.error(error?.message || "Failed to remove logo");
    },
  });
}

export function useGeneralSettings() {
  const toast = useToast();

  return useQuery({
    queryKey: COMPANY_SETTINGS_KEY,
    queryFn: async () => {
      try {
        return await getGeneralSettings();
      } catch (error) {
        const err = error as ApiErrorType;
        toast.error(err?.message || "Failed to load general settings");
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateGeneralSettings() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateGeneralSettingsRequest) => updateGeneralSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_SETTINGS_KEY });
      toast.success("General settings updated successfully");
    },
    onError: (error: ApiErrorType) => {
      toast.error(error?.message || "Failed to update general settings");
    },
  });
}

export function useAttendanceSettings() {
  const toast = useToast();

  return useQuery({
    queryKey: COMPANY_ATTENDANCE_KEY,
    queryFn: async () => {
      try {
        return await getAttendanceSettings();
      } catch (error) {
        const err = error as ApiErrorType;
        toast.error(err?.message || "Failed to load attendance settings");
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateAttendanceSettings() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAttendanceSettingsRequest) => updateAttendanceSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COMPANY_ATTENDANCE_KEY });
      toast.success("Attendance settings updated successfully");
    },
    onError: (error: ApiErrorType) => {
      toast.error(error?.message || "Failed to update attendance settings");
    },
  });
}
