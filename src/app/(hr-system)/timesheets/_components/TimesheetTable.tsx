"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, Lock } from "lucide-react";
import type { Timesheet } from "@/app/(hr-system)/timesheets/types/timesheet.dto";
import { TimesheetStatusBadge } from "./TimesheetStatusBadge";
import { OvertimeChip } from "./OvertimeChip";
import { ApproveRejectModal } from "./ApproveRejectModal";
import { TimesheetEditDrawer } from "./TimesheetEditDrawer";
import { useEditTimesheet } from "@/app/(hr-system)/timesheets/hooks/useTimesheets";

interface Props {
  timesheets: Timesheet[];
  isHR: boolean;
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(date: Date | null) {
  if (!date) return "\u2014";
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function formatHours(hours: number | null) {
  return hours?.toFixed(2) ?? "\u2014";
}

function TimesheetRow({ sheet, isHR }: { sheet: Timesheet; isHR: boolean }) {
  const t = useTranslations("timesheet");
  const editMutation = useEditTimesheet();
  const [showReview, setShowReview] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editActionId, setEditActionId] = useState<string | null>(null);

  const canEdit = isHR && (sheet.status === "DRAFT" || sheet.status === "REJECTED");
  const canReview = isHR && sheet.status === "SUBMITTED";
  const isLocked = sheet.status === "APPROVED";

  async function handleEdit(data: { checkIn?: string; checkOut?: string; notes?: string }) {
    setEditActionId(sheet.id);
    try {
      await editMutation.mutateAsync({ id: sheet.id, data });
      setEditing(false);
    } catch {
    } finally {
      setEditActionId(null);
    }
  }

  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 font-medium text-gray-800">
          {sheet.user ? `${sheet.user.firstName} ${sheet.user.lastName}` : sheet.userId.slice(0, 8)}
        </td>
        <td className="px-4 py-3 text-gray-600">{sheet.user?.employeeCode || "\u2014"}</td>
        <td className="px-4 py-3 text-gray-600">{formatDate(sheet.date)}</td>
        <td className="px-4 py-3 text-gray-600">{formatTime(sheet.checkIn)}</td>
        <td className="px-4 py-3 text-gray-600">{formatTime(sheet.checkOut)}</td>
        <td className="px-4 py-3 text-gray-600">{formatHours(sheet.totalHours)}</td>
        <td className="px-4 py-3"><OvertimeChip hours={sheet.overtimeHours} /></td>
        <td className="px-4 py-3"><TimesheetStatusBadge status={sheet.status} /></td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-2">
            {isLocked && (
              <span className="text-gray-300" title={t("locked")}>
                <Lock size={14} />
              </span>
            )}
            {canEdit && (
              <button
                onClick={() => setEditing(true)}
                disabled={editActionId === sheet.id}
                className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
              >
                {editActionId === sheet.id ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  "Edit"
                )}
              </button>
            )}
            {canReview && (
              <button
                onClick={() => setShowReview(true)}
                className="text-xs font-medium text-primary hover:underline"
              >
                {t("review.approve")}
              </button>
            )}
          </div>
        </td>
      </tr>
      {showReview && (
        <ApproveRejectModal
          timesheet={sheet}
          onClose={() => setShowReview(false)}
        />
      )}
      {editing && (
        <TimesheetEditDrawer
          timesheet={sheet}
          onClose={() => setEditing(false)}
          onSave={handleEdit}
        />
      )}
    </>
  );
}

export function TimesheetTable({ timesheets, isHR }: Props) {
  const t = useTranslations("timesheet.table");

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("employee")}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("employeeCode")}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("date")}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("checkIn")}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("checkOut")}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("totalHours")}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("overtime")}</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">{t("status")}</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {timesheets.map((sheet) => (
              <TimesheetRow key={sheet.id} sheet={sheet} isHR={isHR} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
