"use client";

import { useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Clock, LogIn, LogOut, CheckCircle } from "lucide-react";
import { LocationStatus } from "@/app/[locale]/(hr-system)/attendance/_components/LocationStatus";
import { useGeolocation } from "@/app/[locale]/(hr-system)/attendance/hooks/useGeolocation";
import { useMyTimesheets } from "@/app/[locale]/(hr-system)/attendance/hooks/useMyTimesheets";
import { useAttendanceMark } from "@/app/[locale]/(hr-system)/attendance/hooks/useAttendance";
import { SpinnerIndicator } from "@/components/ui/data-states";
import type { AttendanceError } from "@/app/[locale]/(hr-system)/attendance/api/attendance";

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return { start, end };
}

type WidgetView = "loading" | "not_checked_in" | "checked_in" | "complete" | "disabled_feature";

export function AttendanceWidget() {
  const t = useTranslations("timesheet");
  const [widgetView, setWidgetView] = useState<WidgetView>("loading");

  const { state: geoState, refreshLocation, retryLocation } = useGeolocation();
  const { data: myTimesheets = [], isLoading: timesheetsLoading } = useMyTimesheets();
  const markMutation = useAttendanceMark();

  const todayRecord = useMemo(() => {
    const { start, end } = getTodayRange();
    return myTimesheets.find((ts) => {
      const d = new Date(ts.date);
      return d >= start && d <= end;
    }) ?? null;
  }, [myTimesheets]);

  const computedView = useMemo<WidgetView>(() => {
    if (timesheetsLoading) return "loading";
    if (!todayRecord) return "not_checked_in";
    if (todayRecord.checkIn && !todayRecord.checkOut) return "checked_in";
    if (todayRecord.checkIn && todayRecord.checkOut) return "complete";
    return "not_checked_in";
  }, [timesheetsLoading, todayRecord]);

  const resolvedView = widgetView !== "loading" ? widgetView : computedView;

  const gpsDenied = geoState === "denied";
  const canSubmit = resolvedView === "not_checked_in" || resolvedView === "checked_in";

  const handleAction = useCallback(async () => {
    if (!canSubmit || markMutation.isPending) return;

    const freshCoords = await refreshLocation();
    const lat = freshCoords?.lat ?? 0;
    const lng = freshCoords?.lng ?? 0;

    try {
      const result = await markMutation.mutateAsync({ lat, lng });
      if (result.action === "checked_in") setWidgetView("checked_in");
      if (result.action === "checked_out") setWidgetView("complete");
    } catch (err) {
      const error = err as AttendanceError;
      if (error?.code === "FEATURE_DISABLED") {
        setWidgetView("disabled_feature");
      } else if (error?.code === "ALREADY_RECORDED") {
        setWidgetView("complete");
      }
    }
  }, [canSubmit, markMutation, refreshLocation]);

  if (resolvedView === "disabled_feature") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">{t("widget.disabledMessage")}</p>
      </div>
    );
  }

  if (resolvedView === "loading") {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 flex items-center justify-center">
        <SpinnerIndicator show />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <div className="mb-6">
        {resolvedView === "not_checked_in" && (
          <Clock className="w-14 h-14 text-gray-300 mx-auto mb-3" />
        )}
        {resolvedView === "checked_in" && (
          <LogIn className="w-14 h-14 text-amber-500 mx-auto mb-3" />
        )}
        {resolvedView === "complete" && (
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
        )}
      </div>

      <button
        onClick={handleAction}
        disabled={!canSubmit || markMutation.isPending}
        className={`
          w-64 h-16 rounded-full text-lg font-bold shadow-lg transition-all duration-200
          inline-flex items-center justify-center gap-3
          disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
          active:scale-95
          ${resolvedView === "not_checked_in"
            ? "bg-green-500 hover:bg-green-600 text-white shadow-green-500/30"
            : resolvedView === "checked_in"
              ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        {markMutation.isPending ? (
          <SpinnerIndicator show />
        ) : resolvedView === "not_checked_in" ? (
          <>
            <LogIn size={22} />
            {t("widget.checkIn")}
          </>
        ) : resolvedView === "checked_in" ? (
          <>
            <LogOut size={22} />
            {t("widget.checkOut")}
          </>
        ) : (
          <>
            <CheckCircle size={22} />
            {t("widget.complete")}
          </>
        )}
      </button>

      {resolvedView === "complete" && todayRecord && (
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div>
            <span className="text-gray-500">{t("widget.totalHours")}: </span>
            <span className="font-semibold text-gray-800">
              {todayRecord.totalHours?.toFixed(2) ?? "0.00"}
            </span>
          </div>
          {(todayRecord.overtimeHours ?? 0) > 0 && (
            <div>
              <span className="text-gray-500">{t("widget.overtimeHours")}: </span>
              <span className="font-semibold text-amber-600">
                {(todayRecord.overtimeHours ?? 0).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <LocationStatus state={geoState} onRetry={retryLocation} />
      </div>

      {gpsDenied && (
        <div className="mt-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">{t("widget.locationDeniedWarning")}</p>
        </div>
      )}

      {markMutation.isPending && (
        <p className="mt-3 text-sm text-gray-500">{t("widget.submitting")}</p>
      )}
    </div>
  );
}
