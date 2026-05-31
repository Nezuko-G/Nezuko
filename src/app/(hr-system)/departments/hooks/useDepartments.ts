import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/lib/api/endpoints/departments";
import { useDepartmentUIStore } from "./useDepartmentUIStore";

export const useDepartments = (params: { page?: number; limit?: number; search?: string; parentId?: string }) => {
  return useQuery({
    queryKey: ["departments", params],
    queryFn: () => getDepartments(params),
  });
};

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => getDepartment(id),
    enabled: !!id,
  });
}

export function useDepartmentMutations() {
  const queryClient = useQueryClient();
  const { closeModal } = useDepartmentUIStore();

  const onSuccessAction = () => {
    queryClient.invalidateQueries({ queryKey: ["departments"] });
    queryClient.invalidateQueries({ queryKey: ["department"] });
    closeModal();
  };

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: onSuccessAction,
  });

  const updateMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: onSuccessAction,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: onSuccessAction,
  });

  return {
    createDepartment: createMutation,
    updateDepartment: updateMutation,
    deleteDepartment: deleteMutation,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}