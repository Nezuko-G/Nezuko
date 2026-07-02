"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  label,
}: PaginationProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 px-6 py-4"
      )}
    >
      {label && <p className="text-sm font-bold text-content-muted">{label}</p>}
      <div className="flex items-center gap-1.5 ltr:flex-row-reverse rtl:flex-row">
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-content-dark transition hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-content-dark transition hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
}
