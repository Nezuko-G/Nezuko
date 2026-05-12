"use client";

import { useAssetUIStore } from "@/app/[locale]/(hr-system)/asset/hooks/useAssetUIStore";
import AssetFormModal from "./AssetFormModal";
import CustodyActionModal from "./CustodyActionModal";

export default function AssetModalsContainer() {
  const { isModalOpen, modalType } = useAssetUIStore();

  if (!isModalOpen || !modalType) return null;

  if (modalType === "CREATE" || modalType === "EDIT") {
    return <AssetFormModal />;
  }

  return <CustodyActionModal />;
}
