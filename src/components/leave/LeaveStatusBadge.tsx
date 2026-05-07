"use client"

import { cn } from "@/lib/utils";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
  label: string;
  className?: string;
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  APPROVED: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  REJECTED: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  CANCELLED: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

export default function LeaveStatusBadge({
  status,
  label,
  className,
}: LeaveStatusBadgeProps) {
  const styles = statusStyles[status] || statusStyles.PENDING;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
        styles.bg,
        styles.text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", styles.dot)} />
      {label}
    </span>
  );
}