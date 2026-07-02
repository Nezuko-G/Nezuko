"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { listIncentives, deleteIncentive } from "../api/payroll.api";
import type { Incentive, IncentiveType } from "../types/payroll.types";
import {
  IncentiveTypeBadge,
  ConfirmModal,
  formatCurrency,
  PageHeader,
  EmptyState,
  TableSkeleton,
} from "../components/shared";
import { AddIncentiveModal } from "../components/AddIncentiveModal";
import { Pagination } from "@/app/(hr-system)/_components/Pagination";

export default function IncentivesPage() {
  const t = useTranslations("payroll");
  const [incentives, setIncentives] = useState<Incentive[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<IncentiveType | "ALL">("ALL");
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Incentive | null>(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const limit = 10;

  const fetchIncentives = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listIncentives({
        ...(typeFilter !== "ALL" && { type: typeFilter }),
        page,
        limit,
      });
      setIncentives(res.incentives || []);
      setLastPage(res.meta?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, page]);

  useEffect(() => {
    fetchIncentives();
  }, [fetchIncentives]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value as IncentiveType | "ALL");
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteIncentive(deleteTarget.id);
    setDeleteTarget(null);
    fetchIncentives();
  };

  const isPaidLinked = (inc: Incentive) => !!inc.payrollEntry;

  const tableHeaders = [
    t("incentives.table.employee"),
    t("incentives.table.type"),
    t("incentives.table.amount"),
    t("incentives.table.description"),
    t("incentives.table.effectiveDate"),
    t("incentives.table.linkedPayroll"),
    t("incentives.table.actions"),
  ];

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 flex flex-col gap-4">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-4">
        <PageHeader
          title={t("incentives.title")}
          subtitle={t("incentives.subtitle")}
          action={
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-secondary font-semibold text-sm transition-colors shadow-sm cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {t("incentives.addBtn")}
            </button>
          }
        />

        <div className="w-25 max-w-xs">
          <select
            value={typeFilter}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-card text-content text-sm font-semibold focus:outline-none cursor-pointer shadow-sm"
          >
            <option value="ALL">{t("incentiveType.ALL")}</option>
            <option value="BONUS">{t("incentiveType.BONUS")}</option>
            <option value="COMMISSION">{t("incentiveType.COMMISSION")}</option>
            <option value="OVERTIME">{t("incentiveType.OVERTIME")}</option>
            <option value="DEDUCTION">{t("incentiveType.DEDUCTION")}</option>
            <option value="OTHER">{t("incentiveType.OTHER")}</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-4">
            <TableSkeleton rows={5} cols={7} />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {tableHeaders.map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-content-muted uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {incentives.length === 0 ? (
                      <tr>
                        <td colSpan={7}>
                          <EmptyState message={t("incentives.empty")} />
                        </td>
                      </tr>
                    ) : (
                      incentives.map((inc) => {
                        const linked = isPaidLinked(inc);
                        return (
                          <tr
                            key={inc.id}
                            className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="px-4 py-3.5">
                              <p className="font-semibold text-content-dark">
                                {inc.user.firstName} {inc.user.lastName}
                              </p>
                            </td>
                            <td className="px-4 py-3.5">
                              <IncentiveTypeBadge type={inc.type} />
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`font-semibold ${inc.type === "DEDUCTION" ? "text-red-500" : "text-emerald-600"}`}
                              >
                                {inc.type === "DEDUCTION" ? "-" : "+"}
                                {formatCurrency(inc.amount)}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-content-muted max-w-45 truncate">
                              {inc.description || (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-content whitespace-nowrap">
                              {new Date(inc.effectiveDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3.5 text-content-muted">
                              {inc.payrollEntry ? (
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                  {t("incentives.linkedBadge")}
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              {linked ? (
                                <div className="relative group inline-block">
                                  <button
                                    disabled
                                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
                                  >
                                    {t("incentives.deleteBtn")}
                                  </button>
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    {t("incentives.cannotDeleteTooltip")}
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteTarget(inc)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                                >
                                  {t("incentives.deleteBtn")}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={page}
              totalPages={lastPage}
              onPageChange={setPage}
              label={t("runs.pagination", { current: page, total: lastPage })}
              className="mt-auto"
            />
          </>
        )}
      </div>

      <AddIncentiveModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={() => fetchIncentives()}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t("incentives.confirmDeleteTitle")}
        description={t("incentives.confirmDeleteDesc", {
          type: deleteTarget?.type?.toLowerCase() ?? "",
          amount: deleteTarget ? formatCurrency(deleteTarget.amount) : "",
        })}
        confirmLabel={t("incentives.confirmDeleteBtn")}
        confirmVariant="danger"
      />
    </div>
  );
}
