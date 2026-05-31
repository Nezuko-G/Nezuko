import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInsurancePlans,
  createInsurancePlan,
  updateInsurancePlan,
  deleteInsurancePlan,
  enrollEmployee,
  getCoverageReport,
  getMyInsurance,
  getCostPreview,
  addDependent,
  removeDependent,
} from "@/lib/api/endpoints/insurance";
import { useInsuranceUIStore } from "./useInsuranceUIStore";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

export const useInsurancePlans = (params?: { page?: number; limit?: number; type?: string; isActive?: boolean }) => {
  return useQuery({
    queryKey: ["insurance-plans", params],
    queryFn: () => getInsurancePlans(params),
  });
};

export const useCoverageReport = () => {
  return useQuery({
    queryKey: ["insurance-coverage-report"],
    queryFn: getCoverageReport,
  });
};

export const useMyInsurance = () => {
  return useQuery({
    queryKey: ["my-insurance"],
    queryFn: getMyInsurance,
  });
};

export const useCostPreview = (planId: string, userId: string) => {
  return useQuery({
    queryKey: ["cost-preview", planId, userId],
    queryFn: () => getCostPreview(planId, userId),
    enabled: !!planId && !!userId,
  });
};

export function useInsuranceMutations() {
  const queryClient = useQueryClient();
  const { closeDrawer, closeModal } = useInsuranceUIStore();
  const t = useTranslations("insurance.errors");

  const invalidatePlans = () => {
    queryClient.invalidateQueries({ queryKey: ["insurance-plans"] });
    queryClient.invalidateQueries({ queryKey: ["insurance-coverage-report"] });
  };

  const invalidateEnrollments = () => {
    queryClient.invalidateQueries({ queryKey: ["my-insurance"] });
    queryClient.invalidateQueries({ queryKey: ["insurance-coverage-report"] });
  };

  const createPlanMutation = useMutation({
    mutationFn: createInsurancePlan,
    onSuccess: () => {
      invalidatePlans();
      closeDrawer();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error(t("duplicatePlan"));
      } else {
        toast.error(t("genericError"));
      }
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: updateInsurancePlan,
    onSuccess: () => {
      invalidatePlans();
      closeDrawer();
    },
    onError: () => toast.error(t("genericError")),
  });

  const deletePlanMutation = useMutation({
    mutationFn: deleteInsurancePlan,
    onSuccess: () => {
      invalidatePlans();
      closeModal();
    },
    onError: () => toast.error(t("genericError")),
  });

  const enrollEmployeeMutation = useMutation({
    mutationFn: enrollEmployee,
    onSuccess: () => {
      invalidatePlans();
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error(t("duplicateEnrollment"));
      } else {
        toast.error(t("genericError"));
      }
    },
  });

  const addDependentMutation = useMutation({
    mutationFn: addDependent,
    onSuccess: () => {
      invalidateEnrollments();
      closeModal();
    },
    onError: () => toast.error(t("genericError")),
  });

  const removeDependentMutation = useMutation({
    mutationFn: removeDependent,
    onSuccess: () => {
      invalidateEnrollments();
      closeModal();
    },
    onError: () => toast.error(t("genericError")),
  });

  return {
    createPlan: createPlanMutation,
    updatePlan: updatePlanMutation,
    deletePlan: deletePlanMutation,
    enrollEmployee: enrollEmployeeMutation,
    addDependent: addDependentMutation,
    removeDependent: removeDependentMutation,
    isLoading:
      createPlanMutation.isPending ||
      updatePlanMutation.isPending ||
      deletePlanMutation.isPending ||
      enrollEmployeeMutation.isPending ||
      addDependentMutation.isPending ||
      removeDependentMutation.isPending,
  };
}