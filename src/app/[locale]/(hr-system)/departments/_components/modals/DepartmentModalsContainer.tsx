"use client";

import { useDepartmentUIStore } from "@/app/[locale]/(hr-system)/departments/hooks/useDepartmentUIStore";
import DepartmentFormModal from "./DepartmentFormModal";

export default function DepartmentModalsContainer() {
  const { isModalOpen, modalType } = useDepartmentUIStore();

  if (!isModalOpen || !modalType) return null;

  return <DepartmentFormModal />;
}