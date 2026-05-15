"use client";

import { useState } from "react";
import {
  useAttendanceSettings,
  useUpdateAttendanceSettings,
} from "../hooks/useCompany";
import type { UpdateAttendanceSettingsRequest } from "../types/company.dto";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button";

const EDIT_ROLES = ["HR"];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function AttendanceSettingsForm() {
  const { data, isLoading } = useAttendanceSettings();
  const updateMutation = useUpdateAttendanceSettings();
  const { role } = useAuthStore();
  const canEdit = EDIT_ROLES.includes(role);

  const [form, setForm] = useState({
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
  });
  const [initialized, setInitialized] = useState(false);

  if (data && !initialized) {
    const s = data.data;
    setForm({
      workDayStart: s.workDayStart ?? "09:00",
      workDayEnd: s.workDayEnd ?? "17:00",
      workingDays: s.workingDays ?? [0, 1, 2, 3, 4],
      lateGraceMinutes: s.lateGraceMinutes ?? 15,
      earlyLeaveGrace: s.earlyLeaveGrace ?? 10,
      overtimeThreshold: s.overtimeThreshold ?? 30,
      roundingEnabled: s.roundingEnabled ?? false,
      roundingMinutes: s.roundingMinutes ?? 15,
      requireBiometric: s.requireBiometric ?? false,
      geofenceEnabled: s.geofenceEnabled ?? false,
      locationAttendanceEnabled: s.locationAttendanceEnabled ?? false,
      requireLocation: s.requireLocation ?? false,
      geofenceLat: s.geofenceLat ?? 0,
      geofenceLng: s.geofenceLng ?? 0,
      geofenceRadiusM: s.geofenceRadiusM ?? 500,
    });
    setInitialized(true);
  }

  const update = (key: string, value: string | number | boolean | number[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleDay = (day: number) => {
    const next = form.workingDays.includes(day)
      ? form.workingDays.filter((d) => d !== day)
      : [...form.workingDays, day];
    update("workingDays", next);
  };

  const resetToDefaults = () => {
    setForm({
      workDayStart: "09:00",
      workDayEnd: "17:00",
      workingDays: [0, 1, 2, 3, 4],
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
    });
  };

  const handleSave = () => {
    updateMutation.mutate({
      workDayStart: form.workDayStart,
      workDayEnd: form.workDayEnd,
      workingDays: form.workingDays,
      lateGraceMinutes: form.lateGraceMinutes,
      earlyLeaveGrace: form.earlyLeaveGrace,
      overtimeThreshold: form.overtimeThreshold,
      roundingEnabled: form.roundingEnabled,
      roundingMinutes: form.roundingEnabled ? form.roundingMinutes : null,
      requireBiometric: form.requireBiometric,
      geofenceEnabled: form.geofenceEnabled,
      locationAttendanceEnabled: form.geofenceEnabled ? form.locationAttendanceEnabled : false,
      requireLocation: form.geofenceEnabled ? form.requireLocation : false,
      geofenceLat: form.geofenceEnabled ? form.geofenceLat : null,
      geofenceLng: form.geofenceEnabled ? form.geofenceLng : null,
      geofenceRadiusM: form.geofenceEnabled ? form.geofenceRadiusM : null,
    } satisfies UpdateAttendanceSettingsRequest);
  };

  if (isLoading) {
    return <div className="text-content-muted p-6">Loading...</div>;
  }

  const labelClass = "block text-sm font-medium text-content mb-1";
  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-content focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed";
  const fieldRow = "grid grid-cols-1 md:grid-cols-2 gap-4";
  const toggleClass = (on: boolean) =>
    `relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      on ? "bg-primary" : "bg-gray-300"
    } disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="space-y-8">
      {/* ── Work Schedule ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">Work Schedule</h3>
        <div className={fieldRow}>
          <div>
            <label className={labelClass}>Work Day Start</label>
            <input
              type="time"
              className={inputClass}
              value={form.workDayStart}
              onChange={(e) => update("workDayStart", e.target.value)}
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className={labelClass}>Work Day End</label>
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
        <h3 className="text-base font-semibold text-content-dark mb-4">Working Days</h3>
        <div className="flex flex-wrap gap-2">
          {DAY_LABELS.map((label, i) => {
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
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grace Periods ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <h3 className="text-base font-semibold text-content-dark mb-4">Grace Periods</h3>
        <div className={fieldRow}>
          <div>
            <label className={labelClass}>Late Grace (minutes)</label>
            <input
              type="number"
              min={0}
              max={120}
              className={inputClass}
              value={form.lateGraceMinutes}
              onChange={(e) => update("lateGraceMinutes", Number(e.target.value))}
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className={labelClass}>Early Leave Grace (minutes)</label>
            <input
              type="number"
              min={0}
              max={120}
              className={inputClass}
              value={form.earlyLeaveGrace}
              onChange={(e) => update("earlyLeaveGrace", Number(e.target.value))}
              disabled={!canEdit}
            />
          </div>
          <div>
            <label className={labelClass}>Overtime Threshold (minutes)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.overtimeThreshold}
              onChange={(e) => update("overtimeThreshold", Number(e.target.value))}
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* ── Rounding ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-content-dark">Rounding</h3>
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => update("roundingEnabled", !form.roundingEnabled)}
            className={toggleClass(form.roundingEnabled)}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                form.roundingEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        {form.roundingEnabled && (
          <div className="max-w-xs">
            <label className={labelClass}>Rounding Interval (minutes)</label>
            <select
              value={form.roundingMinutes}
              onChange={(e) => update("roundingMinutes", Number(e.target.value))}
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
          <h3 className="text-base font-semibold text-content-dark">Require Biometric</h3>
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => update("requireBiometric", !form.requireBiometric)}
            className={toggleClass(form.requireBiometric)}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                form.requireBiometric ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Geofence ── */}
      <div className="rounded-xl border border-gray-200 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-content-dark">Geofence</h3>
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => update("geofenceEnabled", !form.geofenceEnabled)}
            className={toggleClass(form.geofenceEnabled)}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                form.geofenceEnabled ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        {form.geofenceEnabled && (
          <div className={fieldRow}>
            <div>
              <label className={labelClass}>Latitude</label>
              <input
                type="number"
                step="any"
                className={inputClass}
                value={form.geofenceLat}
                onChange={(e) => update("geofenceLat", Number(e.target.value))}
                disabled={!canEdit}
              />
            </div>
            <div>
              <label className={labelClass}>Longitude</label>
              <input
                type="number"
                step="any"
                className={inputClass}
                value={form.geofenceLng}
                onChange={(e) => update("geofenceLng", Number(e.target.value))}
                disabled={!canEdit}
              />
            </div>
            <div>
              <label className={labelClass}>Radius (meters)</label>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={form.geofenceRadiusM}
                onChange={(e) => update("geofenceRadiusM", Number(e.target.value))}
                disabled={!canEdit}
              />
            </div>
          </div>
        )}
      </div>

      {canEdit && (
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
