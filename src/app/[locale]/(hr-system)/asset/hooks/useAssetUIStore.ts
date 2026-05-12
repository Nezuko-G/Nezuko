import { create } from "zustand";
import { AssetDTO } from "@/types/dto/asset.dto";

type ModalType = "ASSIGN" | "RETURN" | "TRANSFER" | "EDIT" | "CREATE" | null;

interface AssetUIState {
  isModalOpen: boolean;
  modalType: ModalType;
  selectedAsset:typeof AssetDTO | null; 
  openModal: (type: ModalType, asset?:typeof AssetDTO) => void; 
  closeModal: () => void;
}

export const useAssetUIStore = create<AssetUIState>((set) => ({
  isModalOpen: false,
  modalType: null,
  selectedAsset: null,
  openModal: (type, asset = null) => set({ isModalOpen: true, modalType: type, selectedAsset: asset }),
  closeModal: () => set({ isModalOpen: false, modalType: null, selectedAsset: null }),
}));