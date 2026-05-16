import { create } from "zustand";
import { InsurancePlan, Dependent } from "@/types/dto/insurance.dto";

type DrawerType = "CREATE_PLAN" | "EDIT_PLAN" | null;
type ModalType = "DEACTIVATE_PLAN" | "ADD_DEPENDENT" | "REMOVE_DEPENDENT" | null;

interface InsuranceUIState {
  isDrawerOpen: boolean;
  drawerType: DrawerType;
  selectedPlan: InsurancePlan | null;
  isModalOpen: boolean;
  modalType: ModalType;
  selectedDependent: Dependent | null;
  openDrawer: (type: DrawerType, plan?: InsurancePlan | null) => void;
  closeDrawer: () => void;
  openModal: (type: ModalType, payload?: { plan?: InsurancePlan | null; dependent?: Dependent | null }) => void;
  closeModal: () => void;
}

export const useInsuranceUIStore = create<InsuranceUIState>((set) => ({
  isDrawerOpen: false,
  drawerType: null,
  selectedPlan: null,
  isModalOpen: false,
  modalType: null,
  selectedDependent: null,
  openDrawer: (type, plan = null) =>
    set({ isDrawerOpen: true, drawerType: type, selectedPlan: plan }),
  closeDrawer: () =>
    set({ isDrawerOpen: false, drawerType: null, selectedPlan: null }),
  openModal: (type, payload = {}) =>
    set({
      isModalOpen: true,
      modalType: type,
      selectedPlan: payload.plan || null,
      selectedDependent: payload.dependent || null,
    }),
  closeModal: () =>
    set({
      isModalOpen: false,
      modalType: null,
      selectedPlan: null,
      selectedDependent: null,
    }),
}));