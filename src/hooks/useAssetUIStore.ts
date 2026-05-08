import { create } from "zustand";
import { Asset } from "@/types/dto/asset.dto";

type ModalType = "ASSIGN" | "RETURN" | "TRANSFER" | "EDIT" | null;

interface AssetUIState {
  isModalOpen: boolean;
  modalType: ModalType;
  selectedAsset: Asset | null;
  openModal: (type: ModalType, asset: Asset) => void;
  closeModal: () => void;
}

export const useAssetUIStore = create<AssetUIState>((set) => ({
  isModalOpen: false,
  modalType: null,
  selectedAsset: null,
  openModal: (type, asset) => set({ isModalOpen: true, modalType: type, selectedAsset: asset }),
  closeModal: () => set({ isModalOpen: false, modalType: null, selectedAsset: null }),
}));