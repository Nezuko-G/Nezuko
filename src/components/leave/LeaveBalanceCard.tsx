"use client"

import { Plane, Frown, Megaphone, DollarSign, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaveBalanceCardProps {
  type: "ANNUAL" | "SICK" | "OFFICIAL" | "UNPAID";
  used: number;
  total: number;
  label: string;
  className?: string;
}

const icons: Record<string, LucideIcon> = {
  ANNUAL: Plane,
  SICK: Frown,
  OFFICIAL: Megaphone,
  UNPAID: DollarSign,
};

const colorMap: Record<string, { bg: string; color: string }> = {
  ANNUAL: { bg: "bg-blue-50", color: "text-blue-500" },
  SICK: { bg: "bg-orange-50", color: "text-orange-500" },
  OFFICIAL: { bg: "bg-gray-100", color: "text-gray-500" },
  UNPAID: { bg: "bg-yellow-50", color: "text-yellow-600" },
};

export default function LeaveBalanceCard({
  type,
  used,
  total,
  label,
  className,
}: LeaveBalanceCardProps) {
  const Icon = icons[type];
  const colors = colorMap[type];
  const remaining = total - used;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 transition-transform hover:-translate-y-1 hover:shadow-md",
        className
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          colors.bg
        )}
      >
        <Icon size={24} className={colors.color} strokeWidth={1.5} />
      </div>
      <div className="text-center">
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <p className="text-xl font-black text-gray-900">
          {remaining}/{total}
        </p>
        <p className="text-sm font-medium text-gray-500">
          {used} used
        </p>
      </div>
    </div>
  );
}