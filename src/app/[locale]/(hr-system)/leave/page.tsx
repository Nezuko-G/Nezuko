"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useLeaveRequests } from "@/app/[locale]/(hr-system)/leave/hooks/useLeaveRequests";
import { useAuthStore } from "@/hooks/useAuthStore";
import { LeaveRequestForm } from "./_components/LeaveRequestForm";
import { LeaveRequestsTable } from "./_components/LeaveRequestsTable";
import { LeaveFilters } from "./_components/LeaveFilters";
import type { LeaveRequest } from "@/app/[locale]/(hr-system)/leave/types/leave.dto";

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" /></td>
      <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" /></td>
    </tr>
  );
}

export default function LeavePage() {
  const { role } = useAuthStore();
  const isHR = role === "HR" || role === "MANAGER";
  const [statusFilter, setStatusFilter] = useState<LeaveRequest["status"] | "ALL">("ALL");
  const [showForm, setShowForm] = useState(false);

  const { data: requests = [], isLoading, isError, error, refetch, isFetching } = useLeaveRequests();

  const filteredRequests = statusFilter === "ALL"
    ? requests
    : requests.filter((r) => r.status === statusFilter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-secondary">
            {isHR ? "All Leave Requests" : "My Leave Requests"}
          </h1>
          {isFetching && !isLoading && (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary/80 text-secondary text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-lg shadow-primary/20"
        >
          + Create Request
        </button>
      </div>

      <div className="mb-6">
        <LeaveFilters statusFilter={statusFilter} onStatusChange={setStatusFilter} />
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Employee</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Start Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">End Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Reason</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </tbody>
          </table>
        </div>
      )}

      {isError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-4">
            {error instanceof Error ? error.message : "Failed to load leave requests"}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-base">No leave requests found</p>
        </div>
      )}

      {!isLoading && !isError && filteredRequests.length > 0 && (
        <LeaveRequestsTable requests={filteredRequests} isHR={isHR} />
      )}

      {showForm && <LeaveRequestForm onClose={() => setShowForm(false)} />}
    </div>
  );
}