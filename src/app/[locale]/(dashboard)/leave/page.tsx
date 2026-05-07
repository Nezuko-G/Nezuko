"use client"

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Plus, Clock, FileText } from "lucide-react";
import { LeaveRequest, CreateLeaveRequestInput } from "@/types/dto/leave.dto";
import {
  LeaveRequestCard,
  LeaveModal,
  LeaveRequestForm,
  LeaveListTable,
} from "@/components/leave";
import { Button } from "@/components/ui/button";
import {
  createLeaveRequest,
  getLeaveRequests,
  getMyLeaveRequests,
  cancelLeaveRequest,
  reviewLeaveRequest,
} from "@/lib/api/endpoints/leave";

interface LeavePageProps {
  userRole?: "admin" | "user";
}

export default function LeavePage({ userRole = "user" }: LeavePageProps) {
  const t = useTranslations("dashboard.leave");

  const [activeTab, setActiveTab] = useState<"mine" | "all">("mine");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);
  const [allRequests, setAllRequests] = useState<LeaveRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = userRole === "admin";

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [myReqs, allReqs] = await Promise.all([
        getMyLeaveRequests(),
        isAdmin ? getLeaveRequests() : Promise.resolve({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }),
      ]);

      setMyRequests(myReqs);
      if (isAdmin && allReqs.data) {
        setAllRequests(allReqs.data);
      }
    } catch (err) {
      console.error("Error fetching leave data:", err);
      setError(t("error"));
    }
  }, [isAdmin, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = [
    { key: "mine", label: t("myRequests"), icon: Clock },
    ...(isAdmin ? [{ key: "all", label: t("allRequests"), icon: FileText }] : []),
  ] as const;

  const displayedRequests = activeTab === "mine" ? myRequests : allRequests;

  const handleSubmit = async (data: CreateLeaveRequestInput) => {
    setIsLoading(true);
    try {
      await createLeaveRequest(data);
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Error submitting request:", err);
      setError(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelLeaveRequest(id);
      await fetchData();
    } catch (err) {
      console.error("Error canceling request:", err);
      setError(t("error"));
    }
  };

  const handleReview = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    note?: string
  ) => {
    try {
      await reviewLeaveRequest(id, { status, reviewNote: note });
      await fetchData();
    } catch (err) {
      console.error("Error reviewing request:", err);
      setError(t("error"));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-black text-gray-900">{t("title")}</h1>

          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus size={20} />
            {t("requestNew")}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all ${
                  isActive
                    ? "text-primary border-b-2 border-primary -mb-px"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === "all" && isAdmin ? (
            displayedRequests.length > 0 ? (
              <LeaveListTable
                requests={displayedRequests}
                showEmployee
                onCancel={handleCancel}
                onReview={handleReview}
              />
            ) : (
              <div className="flex items-center justify-center py-12 text-gray-500 font-medium">
                {t("empty")}
              </div>
            )
          ) : displayedRequests.length > 0 ? (
            <div className="grid gap-4">
              {displayedRequests.map((request) => (
                <LeaveRequestCard
                  key={request.id}
                  request={request}
                  onCancel={handleCancel}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-gray-500 font-medium">
              {t("empty")}
            </div>
          )}
        </div>
      </div>

      <LeaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("requestNew")}
      >
        <LeaveRequestForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
        />
      </LeaveModal>
    </div>
  );
}