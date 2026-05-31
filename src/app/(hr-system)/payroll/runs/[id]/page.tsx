'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getPayrollRunById, approvePayrollRun, markPayrollRunPaid } from '../../api/payroll.api';
import type { PayrollRunDetail, PayrollEntry } from '../../types/payroll.types';
import {
  PayrollStatusBadge,
  PayrollLockBanner,
  ConfirmModal,
  Drawer,
  formatMonthYear,
  formatCurrency,
  NetSalaryCell,
  EmptyState,
  TableSkeleton,
} from '../../components/shared';
import { PayslipDetail } from '../../components/PayslipDetail';

export default function PayrollRunDetailPage() {
  const t = useTranslations('payroll');
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [run, setRun] = useState<PayrollRunDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'markPaid' | null>(null);

  const fetchRun = async () => {
    setLoading(true);
    try {
      const data = await getPayrollRunById(id);
      setRun(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRun();
  }, [id]);

  const filteredEntries = (run?.entries ?? []).filter((e: PayrollEntry) => {
    const name = `${e.user.firstName} ${e.user.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const handleApprove = async () => {
    await approvePayrollRun(id);
    setConfirmAction(null);
    fetchRun();
  };

  const handleMarkPaid = async () => {
    await markPayrollRunPaid(id);
    setConfirmAction(null);
    fetchRun();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded-lg mb-3" />
          <div className="h-4 w-40 bg-gray-100 rounded-lg mb-8" />
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <TableSkeleton rows={6} cols={8} />
          </div>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-8 flex items-center justify-center">
        <p className="text-[var(--color-content-muted)]">{t('runs.empty')}</p>
      </div>
    );
  }

  const headers = [
    t('runDetail.table.employee'),
    t('runDetail.table.baseSalary'),
    t('runDetail.table.otHours'),
    t('runDetail.table.otPay'),
    t('runDetail.table.incentives'),
    t('runDetail.table.deductions'),
    t('runDetail.table.insurance'),
    t('runDetail.table.netSalary')
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push('/payroll/runs')}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-content-muted)] hover:text-[var(--color-content-dark)] mb-5 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t('runDetail.backBtn')}
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[var(--color-content-dark)]">
                {formatMonthYear(run.month, run.year, t)}
              </h1>
              <PayrollStatusBadge status={run.status} />
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[var(--color-content-muted)] mt-1">
              <span>{t('runDetail.createdBy', { name: `${run.creator.firstName} ${run.creator.lastName}` })}</span>
              {run.approver && (
                <span>
                  {t('runDetail.approvedBy', {
                    name: `${run.approver.firstName} ${run.approver.lastName}`,
                    date: run.approvedAt ? new Date(run.approvedAt).toLocaleDateString() : ''
                  })}
                </span>
              )}
              {run.paidAt && (
                <span>
                  {t('runDetail.paidOn', {
                    date: new Date(run.paidAt).toLocaleDateString()
                  })}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {run.status === 'DRAFT' && (
              <button
                onClick={() => setConfirmAction('approve')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                {t('runDetail.approveBtn')}
              </button>
            )}
            {run.status === 'APPROVED' && (
              <button
                onClick={() => setConfirmAction('markPaid')}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                {t('runDetail.markPaidBtn')}
              </button>
            )}
          </div>
        </div>

        <PayrollLockBanner status={run.status} />

        {/* Search */}
        <div className="relative mb-4 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t('runDetail.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
          />
        </div>

        {/* Entries Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {headers.map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-content-muted)] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={8}>
                      <EmptyState message={t('runDetail.empty')} />
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry: PayrollEntry) => (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className="border-b border-gray-50 hover:bg-gray-50/60 cursor-pointer transition-colors group"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] text-xs font-bold flex items-center justify-center shrink-0">
                            {entry.user.firstName[0]}{entry.user.lastName[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[var(--color-content-dark)] truncate">{entry.user.firstName} {entry.user.lastName}</p>
                            <p className="text-xs text-[var(--color-content-muted)] truncate">{entry.user.department?.name ?? t('payslipDetail.noDepartment')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[var(--color-content)]">{formatCurrency(entry.baseSalary)}</td>
                      <td className="px-4 py-3.5 text-[var(--color-content)]">{entry.overtimeHours}h</td>
                      <td className="px-4 py-3.5 text-emerald-600">{formatCurrency(entry.overtimePay)}</td>
                      <td className="px-4 py-3.5 text-emerald-600">{formatCurrency(entry.totalIncentives)}</td>
                      <td className="px-4 py-3.5 text-red-500">{formatCurrency(entry.totalDeductions)}</td>
                      <td className="px-4 py-3.5 text-red-500">{formatCurrency(entry.insuranceAmount)}</td>
                      <td className="px-4 py-3.5">
                        <NetSalaryCell amount={entry.netSalary} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payslip Drawer */}
      <Drawer
        open={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={t('runDetail.drawerTitle')}
      >
        {selectedEntry && (
          <PayslipDetail entry={selectedEntry} month={run.month} year={run.year} />
        )}
      </Drawer>

      {/* Confirm Modals */}
      <ConfirmModal
        open={confirmAction === 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleApprove}
        title={t('runs.confirm.approveTitle', { monthYear: formatMonthYear(run.month, run.year, t) })}
        description={t('runs.confirm.approveDesc')}
        confirmLabel={t('runs.confirm.approveBtn')}
      />
      <ConfirmModal
        open={confirmAction === 'markPaid'}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleMarkPaid}
        title={t('runs.confirm.markPaidTitle', { monthYear: formatMonthYear(run.month, run.year, t) })}
        description={t('runs.confirm.markPaidDesc')}
        confirmLabel={t('runs.confirm.markPaidBtn')}
      />
    </div>
  );
}