"use client"

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plane, Frown, Megaphone, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateLeaveRequestInput } from "@/types/dto/leave.dto";
import { Button } from "@/components/ui/button";

interface LeaveRequestFormProps {
  onSubmit: (data: CreateLeaveRequestInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
  className?: string;
}

const leaveTypes = [
  { value: "ANNUAL", labelKey: "annual", icon: Plane, bg: "bg-blue-50", color: "text-blue-500" },
  { value: "SICK", labelKey: "sick", icon: Frown, bg: "bg-orange-50", color: "text-orange-500" },
  { value: "OFFICIAL", labelKey: "official", icon: Megaphone, bg: "bg-gray-100", color: "text-gray-500" },
  { value: "UNPAID", labelKey: "unpaid", icon: DollarSign, bg: "bg-yellow-50", color: "text-yellow-600" },
] as const;

export default function LeaveRequestForm({
  onSubmit,
  onCancel,
  isLoading = false,
  className,
}: LeaveRequestFormProps) {
  const t = useTranslations("dashboard.leave");
  const tBalances = useTranslations("dashboard.leaveBalances");

  const [formData, setFormData] = useState<CreateLeaveRequestInput>({
    type: "ANNUAL",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = "Please select a leave type";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof CreateLeaveRequestInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-gray-700">
          {t("form.type")}
        </label>

        <div className="grid grid-cols-2 gap-3">
          {leaveTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.type === type.value;

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange("type", type.value)}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-100 hover:border-gray-200"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    type.bg
                  )}
                >
                  <Icon size={20} className={type.color} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {tBalances(type.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
        {errors.type && (
          <p className="text-sm text-status-error font-medium">{errors.type}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            {t("form.startDate")}
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
            className={cn(
              "h-14 rounded-2xl border bg-white px-5 py-2 text-base text-gray-900 transition-all",
              "focus:outline-none focus:ring-2",
              errors.startDate
                ? "border-status-error focus:ring-status-error"
                : "border-gray-200 focus:border-primary focus:ring-primary"
            )}
          />
          {errors.startDate && (
            <p className="text-sm text-status-error font-medium">{errors.startDate}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">
            {t("form.endDate")}
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
            className={cn(
              "h-14 rounded-2xl border bg-white px-5 py-2 text-base text-gray-900 transition-all",
              "focus:outline-none focus:ring-2",
              errors.endDate
                ? "border-status-error focus:ring-status-error"
                : "border-gray-200 focus:border-primary focus:ring-primary"
            )}
          />
          {errors.endDate && (
            <p className="text-sm text-status-error font-medium">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">
          {t("form.reason")}
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder={t("form.reasonPlaceholder")}
          rows={4}
          className={cn(
            "w-full rounded-2xl border border-gray-200 bg-white px-5 py-3 text-base text-gray-900",
            "placeholder:text-zinc-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary",
            "resize-none"
          )}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          {t("form.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Submitting..." : t("form.submit")}
        </Button>
      </div>
    </form>
  );
}