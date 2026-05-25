"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useAttendanceSettings,
  useUpdateAttendanceSettings,
} from "../hooks/useCompany";
import type { UpdateAttendanceSettingsRequest } from "../types/company.dto";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button";
import Toggle from "@/components/ui/toggle";
import { MapPin, Loader2 as Spinner } from "lucide-react";

const EDIT_ROLES = ["HR"];

const DEFAULTS = {
  workDayStart: "09:00",
  workDayEnd: "17:00",
  workingDays: [0, 1, 2, 3, 4] as number[],
  lateGraceMinutes: 15,
  earlyLeaveGrace: 10,
  overtimeThreshold: 30,
  roundingEnabled: false,
  roundingMinutes: 15,
  requireBiometric: false,
  geofenceEnabled: false,
  locationAttendanceEnabled: false,
  requireLocation: false,
  geofenceLat: 0,
  geofenceLng: 0,
  geofenceRadiusM: 500,
};

type FormState = typeof DEFAULTS;
type FormKey = keyof FormState;

type NumberField = { key: FormKey; labelKey: string; min?: number; max?: number };
type GeoField = { key: FormKey; labelKey: string; min?: number; step?: string };

const graceFields: NumberField[] = [
  { key: "lateGraceMinutes", labelKey: "lateGraceMinutes", min: 0, max: 120 },
  { key: "earlyLeaveGrace", labelKey: "earlyLeaveGrace", min: 0, max: 120 },
  { key: "overtimeThreshold", labelKey: "overtimeThreshold", min: 0 },
];

const geofenceFields: GeoField[] = [
  { key: "geofenceLat", labelKey: "geofenceLat", step: "any" },
  { key: "geofenceLng", labelKey: "geofenceLng", step: "any" },
  { key: "geofenceRadiusM", labelKey: "geofenceRadiusM", min: 1 },
];

function mergeWithDefaults(api: { [K in FormKey]?: FormState[K] | null }): FormState {
  const out = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS) as FormKey[]) {
    if (api[key] != null) out[key] = api[key] as never;
  }
  return out;
}

export default function AttendanceSettingsForm() {
  const t = useTranslations("company.attendanceSettings");
  const { data, isLoading } = useAttendanceSettings();
  const updateMutation = useUpdateAttendanceSettings();
  const { role } = useAuthStore();
  const canEdit = EDIT_ROLES.includes(role);

  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [initialized, setInitialized] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  if (data && !initialized) {
    setForm(mergeWithDefaults(data.data));
    setInitialized(true);
  }

  const update = <K extends FormKey>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDay = (day: number) => {
    const next = form.workingDays.includes(day)
      ? form.workingDays.filter((d) => d !== day)
      : [...form.workingDays, day];
    update("workingDays", next as FormState["workingDays"]);
  };

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setGeoError(t("geoErrors.unsupported"));
      return;
    }
    setGeoLoading(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update("geofenceLat", pos.coords.latitude);
        update("geofenceLng", pos.coords.longitude);
        setGeoLoading(false);
      },
      (err) => {
        setGeoLoading(false);
        const map: Record<number, string> = {
          [err.PERMISSION_DENIED]: t("geoErrors.denied"),
          [err.POSITION_UNAVAILABLE]: t("geoErrors.unavailable"),
          [err.TIMEOUT]: t("geoErrors.timeout"),
        };
        setGeoError(map[err.code] ?? t("geoErrors.unavailable"));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  const resetToDefaults = () => setForm({ ...DEFAULTS });

  const handleSave = () => {
    const payload: UpdateAttendanceSettingsRequest = {
      workDayStart: form.workDayStart,
      workDayEnd: form.workDayEnd,
      workingDays: form.workingDays,
      lateGraceMinutes: form.lateGraceMinutes,
      earlyLeaveGrace: form.earlyLeaveGrace,
      overtimeThreshold: form.overtimeThreshold,
      roundingEnabled: form.roundingEnabled,
      requireBiometric: form.requireBiometric,
      geofenceEnabled: form.geofenceEnabled,
    };

    if (form.roundingEnabled) {
      payload.roundingMinutes = form.roundingMinutes;
    }

    payload.locationAttendanceEnabled = form.locationAttendanceEnabled;
    payload.requireLocation = form.requireLocation;

    if (form.geofenceEnabled) {
      payload.geofenceLat = form.geofenceLat;
      payload.geofenceLng = form.geofenceLng;
      payload.geofenceRadiusM = form.geofenceRadiusM;
    }

    updateMutation.mutate(payload);
  };

  if (isLoading) {
    return <div className="text-content-muted p-6">{t("states.loading")}</div>;
  }

  const labelClass = "block text-sm font-medium text-content mb-1";
  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed";
  const fieldRow = "grid grid-cols-1 md:grid-cols-2 gap-4";

  return (
    <div className="space-y-8">
      {/* ── Work Schedule ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">{t("sections.workSchedule")}</h3>
        <div className={fieldRow}>
          <div>
            <label className={labelClass}>{t("fields.workDayStart")}</label>
            <input
              type="time"
              className={inputClass}
              value={form.workDayStart}
              onChange={(e) => update("workDayStart", e.target.value)}
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className={labelClass}>{t("fields.workDayEnd")}</label>
            <input
              type="time"
              className={inputClass}
              value={form.workDayEnd}
              onChange={(e) => update("workDayEnd", e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* ── Working Days ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">{t("sections.workingDays")}</h3>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const active = form.workingDays.includes(i);
            return (
              <button
                key={i}
                type="button"
                disabled={!canEdit}
                onClick={() => toggleDay(i)}
                className={`h-10 w-10 rounded-full text-sm font-bold transition-colors ${
                  active
                    ? "bg-primary text-secondary"
                    : "bg-gray-100 text-content-muted hover:bg-gray-200"
                } disabled:cursor-not-allowed`}
              >
                {t(`days.${i}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grace Periods ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">{t("sections.gracePeriods")}</h3>
        <div className={fieldRow}>
          {graceFields.map(({ key, labelKey, min, max }) => (
            <div key={key}>
              <label className={labelClass}>{t(`fields.${labelKey}`)}</label>
              <input
                type="number"
                min={min}
                max={max}
                className={inputClass}
                value={form[key] as number}
                onChange={(e) => update(key, Number(e.target.value))}
                disabled={!canEdit}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Rounding ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-content-dark">{t("sections.rounding")}</h3>
          <Toggle
            checked={form.roundingEnabled}
            onChange={(v) => update("roundingEnabled", v)}
            disabled={!canEdit}
          />
        </div>
        {form.roundingEnabled && (
          <div className="max-w-xs">
            <label className={labelClass}>{t("fields.roundingInterval")}</label>
            <select
              value={form.roundingMinutes}
              onChange={(e) => update("roundingMinutes", Number(e.target.value) as FormState["roundingMinutes"])}
              disabled={!canEdit}
              className={inputClass}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
            </select>
          </div>
        )}
      </div>

      {/* ── Biometric ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-content-dark">{t("sections.biometric")}</h3>
          <Toggle
            checked={form.requireBiometric}
            onChange={(v) => update("requireBiometric", v)}
            disabled={!canEdit}
          />
        </div>
      </div>

      {/* ── Location Attendance ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-content-dark">{t("sections.locationAttendance")}</h3>
          <Toggle
            checked={form.locationAttendanceEnabled}
            onChange={(v) => update("locationAttendanceEnabled", v)}
            disabled={!canEdit}
          />
        </div>
        {form.locationAttendanceEnabled && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <label className="text-sm text-content">{t("fields.requireLocation")}</label>
            <Toggle
              checked={form.requireLocation}
              onChange={(v) => update("requireLocation", v)}
              disabled={!canEdit}
            />
          </div>
        )}
      </div>

      {/* ── Geofence ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-content-dark">{t("sections.geofence")}</h3>
          <Toggle
            checked={form.geofenceEnabled}
            onChange={(v) => update("geofenceEnabled", v)}
            disabled={!canEdit}
          />
        </div>
        {form.geofenceEnabled && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!canEdit || geoLoading}
                onClick={getCurrentPosition}
              >
                {geoLoading ? (
                  <Spinner size={14} className="animate-spin" />
                ) : (
                  <MapPin size={14} />
                )}
                {t("buttons.getLocation")}
              </Button>
              {geoError && (
                <span className="text-xs text-status-error">{geoError}</span>
              )}
            </div>
            <div className={fieldRow}>
              {geofenceFields.map(({ key, labelKey, min, step }) => (
                <div key={key}>
                  <label className={labelClass}>{t(`fields.${labelKey}`)}</label>
                  <input
                    type="number"
                    step={step}
                    min={min}
                    className={inputClass}
                    value={form[key] as number}
                    onChange={(e) => update(key, Number(e.target.value))}
                    disabled={!canEdit}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {canEdit && (
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={resetToDefaults}>
            {t("buttons.reset")}
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? t("buttons.saving") : t("buttons.save")}
          </Button>
        </div>
      )}
    </div>
  );
}
