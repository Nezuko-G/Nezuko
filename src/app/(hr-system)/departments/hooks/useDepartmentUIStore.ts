import { create } from "zustand";
import { Department } from "../types/department.dto";

type ModalType = "CREATE" | "EDIT" | null;

interface DepartmentUIState {
  isModalOpen: boolean;
  modalType: ModalType;
  selectedDepartment: Department | null;
  openModal: (type: ModalType, department?: Department | null) => void;
  closeModal: () => void;
}

export const useDepartmentUIStore = create<DepartmentUIState>((set) => ({
  isModalOpen: false,
  modalType: null,
  selectedDepartment: null,
  openModal: (type, department = null) =>
    set({ isModalOpen: true, modalType: type, selectedDepartment: department }),
  closeModal: () =>
    set({ isModalOpen: false, modalType: null, selectedDepartment: null }),
}));