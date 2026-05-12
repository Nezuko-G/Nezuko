"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import type { LeaveRequest } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { useReviewLeaveRequest, useCancelLeaveRequest } from "@/app/[locale]/(hr-system)/leave/hooks/useLeaveRequests";

interface Props {
  requests: LeaveRequest[];
  isHR: boolean;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function ReviewDialog({ request, onClose }: { request: LeaveRequest; onClose: () => void }) {
  const t = useTranslations("leave");
  const reviewRequest = useReviewLeaveRequest();
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [reviewNote, setReviewNote] = useState("");

  async function handleSubmit() {
    try {
      await reviewRequest.mutateAsync({ id: request.id, data: { status, reviewNote } });
      onClose();
    } catch {
      // Error is handled by useReviewLeaveRequest's onError
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">{t("reviewTitle")}</h2>
          <button onClick={onClose} disabled={reviewRequest.isPending} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50">
            ✕
          </button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-1">
            <p><span className="text-gray-500">{t("employeeLabel")}</span> <span className="font-medium">{request.user ? `${request.user.firstName} ${request.user.lastName}` : request.userId}</span></p>
            <p><span className="text-gray-500">{t("employeeCodeLabel")}</span> <span className="font-medium">{request.user?.employeeCode || "-"}</span></p>
            <p><span className="text-gray-500">{t("emailLabel")}</span> <span className="font-medium">{request.user?.email || "-"}</span></p>
            <p><span className="text-gray-500">{t("datesLabel")}</span> <span className="font-medium">{formatDate(request.startDate)} → {formatDate(request.endDate)}</span></p>
            <p><span className="text-gray-500">{t("reasonLabel")}</span> {request.reason}</p>
            {request.reviewNote && (
              <p><span className="text-gray-500">{t("previousNote")}</span> {request.reviewNote}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">{t("decision")}</label>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus("APPROVED")}
                disabled={reviewRequest.isPending}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${status === "APPROVED" ? "bg-green-50 text-green-600 border-green-200" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
              >
                {t("approve")}
              </button>
              <button
                onClick={() => setStatus("REJECTED")}
                disabled={reviewRequest.isPending}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${status === "REJECTED" ? "bg-red-50 text-red-500 border-red-200" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
              >
                {t("reject")}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600">{t("reviewNote")}</label>
            <textarea
              rows={2}
              placeholder={t("reviewNotePlaceholder")}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              disabled={reviewRequest.isPending}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:opacity-50"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} disabled={reviewRequest.isPending} className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors">
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={reviewRequest.isPending}
            className={`text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2 ${status === "APPROVED" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
          >
            {reviewRequest.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {t("submitting")}
              </>
            ) : (
              status === "APPROVED" ? t("approve") : t("reject")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function LeaveRequestsTable({ requests, isHR }: Props) {
  const t = useTranslations("leave");
  const cancelRequest = useCancelLeaveRequest();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reviewingRequest, setReviewingRequest] = useState<LeaveRequest | null>(null);

  async function handleCancel(requestId: string) {
    setCancellingId(requestId);
    try {
      await cancelRequest.mutateAsync(requestId);
    } catch {
      // Error is handled by useCancelLeaveRequest's onError
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">{t("employee")}</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">{t("employeeCode")}</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">{t("startDate")}</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">{t("endDate")}</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">{t("reason")}</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">{t("status")}</th>
              {isHR && <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">{t("reviewer")}</th>}
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {request.user ? `${request.user.firstName} ${request.user.lastName}` : request.userId.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-gray-600">{request.user?.employeeCode || "-"}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(request.startDate)}</td>
                <td className="px-4 py-3 text-gray-600">{formatDate(request.endDate)}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate" title={request.reason}>{request.reason}</td>
                <td className="px-4 py-3"><LeaveStatusBadge status={request.status} /></td>
                {isHR && (
                  <td className="px-4 py-3 text-gray-600">
                    {request.reviewer ? `${request.reviewer.firstName} ${request.reviewer.lastName}` : request.reviewerId || "-"}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {isHR && request.status === "PENDING" && (
                      <button
                        onClick={() => setReviewingRequest(request)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {t("reviewAction")}
                      </button>
                    )}
                    {request.status === "PENDING" && !isHR && (
                      <button
                        onClick={() => handleCancel(request.id)}
                        disabled={cancellingId === request.id}
                        className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50 flex items-center gap-1"
                      >
                        {cancellingId === request.id ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            {t("cancelling")}
                          </>
                        ) : (
                          t("cancelAction")
                        )}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {reviewingRequest && (
        <ReviewDialog request={reviewingRequest} onClose={() => setReviewingRequest(null)} />
      )}
    </div>
  );
}