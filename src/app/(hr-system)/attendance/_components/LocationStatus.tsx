"use client";

import { useTranslations } from "next-intl";
import { MapPin, Crosshair, AlertTriangle, RefreshCw } from "lucide-react";
import type { GeolocationState } from "@/app/(hr-system)/attendance/hooks/useGeolocation";

interface Props {
  state: GeolocationState;
  onRetry: () => void;
}

export function LocationStatus({ state, onRetry }: Props) {
  const t = useTranslations("timesheet");

  if (state === "fetching") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Crosshair size={16} className="animate-pulse" />
        <span>{t("widget.detectingLocation")}</span>
      </div>
    );
  }

  if (state === "detected") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <MapPin size={16} />
        <span>{t("widget.locationDetected")}</span>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-500">
        <AlertTriangle size={16} />
        <span>{t("widget.locationDenied")}</span>
        <button
          onClick={onRetry}
          className="ms-1 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 underline"
        >
          <RefreshCw size={12} />
          {t("widget.retryLocation")}
        </button>
      </div>
    );
  }

  if (state === "timed_out") {
    return (
      <div className="flex items-center gap-2 text-sm text-amber-600">
        <AlertTriangle size={16} />
        <span>{t("widget.locationTimeout")}</span>
        <button
          onClick={onRetry}
          className="ms-1 inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 underline"
        >
          <RefreshCw size={12} />
          {t("widget.retryLocation")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <MapPin size={16} />
      <span>{t("widget.locationUnavailable")}</span>
    </div>
  );
}
