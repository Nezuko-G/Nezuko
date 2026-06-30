import { create } from "zustand";
import { z } from "zod";
import { AssetDTO } from "../types/asset.dto";

type ModalType = "ASSIGN" | "RETURN" | "TRANSFER" | "EDIT" | "CREATE" | null;
type AssetType = z.infer<typeof AssetDTO>;

interface AssetUIState {
  isModalOpen: boolean;
  modalType: ModalType;
  selectedAsset: AssetType | null;
  openModal: (type: ModalType, asset?: AssetType | null) => void;
  closeModal: () => void;
}

export const useAssetUIStore = create<AssetUIState>((set) => ({
  isModalOpen: false,
  modalType: null,
  selectedAsset: null,
  openModal: (type, asset = null) =>
    set({ isModalOpen: true, modalType: type, selectedAsset: asset }),
  closeModal: () =>
    set({ isModalOpen: false, modalType: null, selectedAsset: null }),
}));