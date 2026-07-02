"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  useNotifications,
  useNotificationMutations,
} from "@/app/(hr-system)/notifications/hooks/useNotifications";
import { useNotificationUIStore } from "@/app/(hr-system)/notifications/hooks/useNotificationUIStore";
import NotificationTable from "@/app/(hr-system)/notifications/_components/NotificationTable";
import { Loader2, ChevronLeft, ChevronRight, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTERS = [
  { apiValue: "ALL", uiValue: "all" as const },
  { apiValue: "SEEN", uiValue: "read" as const },
  { apiValue: "UNSEEN", uiValue: "unread" as const },
];

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  const { filter, setFilter } = useNotificationUIStore();
  const [page, setPage] = useState(1);
  const limit = 10;

  const params: { page: number; limit: number; filter?: "ALL" | "SEEN" | "UNSEEN" } = {
    page,
    limit,
  };
  if (filter === "read") params.filter = "SEEN";
  else if (filter === "unread") params.filter = "UNSEEN";
  else params.filter = "ALL";

  const { data, isLoading, isError } = useNotifications(params);
  const { markSeen, markAllSeen, isPending } = useNotificationMutations();

  const notifications = data?.data || [];
  const meta = data?.meta;
  const lastPage = meta?.totalPages || 1;

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl mx-auto p-4 md:p-8 text-right">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-secondary">
          {t("page.title")}
        </h1>

        <button
          onClick={() => markAllSeen.mutate()}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-secondary font-bold text-sm shadow hover:opacity-90 transition disabled:opacity-50"
        >
          <CheckCheck size={16} />
          <span>{t("page.markAllSeen")}</span>
        </button>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.apiValue}
            onClick={() => {
              setFilter(f.uiValue);
              setPage(1);
            }}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-bold transition-colors border",
              filter === f.uiValue
                ? "bg-primary text-secondary border-primary"
                : "bg-card text-content-muted border-gray-200 hover:border-primary hover:text-primary",
            )}
          >
            {t(`filters.${f.uiValue}`)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 min-h-100">
            <Loader2 className="animate-spin text-primary" size={36} />
            <p className="text-sm font-bold text-content-muted animate-pulse">
              {t("loading")}
            </p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex items-center justify-center text-status-error font-bold min-h-50">
            {t("errors.fetch")}
          </div>
        ) : (
          <>
            <div className="flex-1">
              <NotificationTable
                notifications={notifications}
                onMarkSeen={(id) => markSeen.mutate(id)}
                isPending={isPending}
              />
            </div>

            {lastPage > 1 && (
              <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-center gap-4 bg-gray-50/50">
                <p className="text-sm text-content-muted font-bold">
                  {t("pagination", { current: page, total: lastPage })}
                </p>
                <div className="flex ltr:flex-row-reverse rtl:flex-row items-center gap-1.5">
                  <button
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-content-dark transition disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
