'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { listPayrollRuns, approvePayrollRun, markPayrollRunPaid } from '../api/payroll.api';
import type { PayrollRun, PayrollStatus } from '../types/payroll.types';
import {
    PayrollStatusBadge,
    ConfirmModal,
    formatMonthYear,
    PageHeader,
    EmptyState,
    TableSkeleton,
} from '../components/shared';
import { CreatePayrollRunModal } from '../components/CreatePayrollRunModal';

const STATUSES: (PayrollStatus | 'ALL')[] = ['ALL', 'DRAFT', 'APPROVED', 'PAID'];

export default function PayrollRunsPage() {
    const t = useTranslations('payroll');
    const router = useRouter();
    const [runs, setRuns] = useState<PayrollRun[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<PayrollStatus | 'ALL'>('ALL');
    const [createOpen, setCreateOpen] = useState(false);
    const [confirmState, setConfirmState] = useState<{
        type: 'approve' | 'markPaid';
        run: PayrollRun;
    } | null>(null);

    const fetchRuns = useCallback(async () => {
        setLoading(true);
        try {
            const res = await listPayrollRuns({
                ...(statusFilter !== 'ALL' && { status: statusFilter }),
                limit: 50,
            });
            setRuns(res.payrollRuns);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchRuns();
    }, [fetchRuns]);

    const handleApprove = async () => {
        if (!confirmState || confirmState.type !== 'approve') return;
        await approvePayrollRun(confirmState.run.id);
        setConfirmState(null);
        fetchRuns();
    };

    const handleMarkPaid = async () => {
        if (!confirmState || confirmState.type !== 'markPaid') return;
        await markPayrollRunPaid(confirmState.run.id);
        setConfirmState(null);
        fetchRuns();
    };

    const headers = [
        t('runs.table.monthYear'),
        t('runs.table.status'),
        t('runs.table.employees'),
        t('runs.table.createdBy'),
        t('runs.table.approvedBy'),
        t('runs.table.paidAt'),
        t('runs.table.actions')
    ];

    return (
        <div className="min-h-screen bg-background p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title={t('runs.title')}
                    subtitle={t('runs.subtitle')}
                    action={
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-secondary font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            {t('runs.createBtn')}
                        </button>
                    }
                />

                {/* Filters */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${statusFilter === s
                                    ? 'bg-secondary text-white'
                                    : 'bg-white border border-gray-200 text-content-muted hover:border-gray-300'
                                }`}
                        >
                            {t(`runs.filters.${s}`)}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/60">
                                    {headers.map(
                                        (h) => (
                                            <th
                                                key={h}
                                                className="px-4 py-3 text-left text-xs font-semibold text-content-muted uppercase tracking-wide whitespace-nowrap"
                                            >
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-2">
                                            <TableSkeleton rows={5} cols={7} />
                                        </td>
                                    </tr>
                                ) : runs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <EmptyState message={t('runs.empty')} />
                                        </td>
                                    </tr>
                                ) : (
                                    runs.map((run) => (
                                        <tr
                                            key={run.id}
                                            className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <td className="px-4 py-3.5 font-semibold text-content-dark whitespace-nowrap">
                                                {formatMonthYear(run.month, run.year, t)}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <PayrollStatusBadge status={run.status} />
                                            </td>
                                            <td className="px-4 py-3.5 text-content-muted">
                                                {run._count.entries}
                                            </td>
                                            <td className="px-4 py-3.5 text-content whitespace-nowrap">
                                                {run.creator.firstName} {run.creator.lastName}
                                            </td>
                                            <td className="px-4 py-3.5 text-content whitespace-nowrap">
                                                {run.approver
                                                    ? `${run.approver.firstName} ${run.approver.lastName}`
                                                    : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-4 py-3.5 text-content-muted whitespace-nowrap">
                                                {run.paidAt
                                                    ? new Date(run.paidAt).toLocaleDateString()
                                                    : <span className="text-gray-300">—</span>}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => router.push(`/payroll/runs/${run.id}`)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-content transition-colors cursor-pointer"
                                                    >
                                                        {t('runs.actions.view')}
                                                    </button>
                                                    {run.status === 'DRAFT' && (
                                                        <button
                                                            onClick={() => setConfirmState({ type: 'approve', run })}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                                                        >
                                                            {t('runs.actions.approve')}
                                                        </button>
                                                    )}
                                                    {run.status === 'APPROVED' && (
                                                        <button
                                                            onClick={() => setConfirmState({ type: 'markPaid', run })}
                                                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                                                        >
                                                            {t('runs.actions.markPaid')}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreatePayrollRunModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSuccess={() => fetchRuns()}
            />

            <ConfirmModal
                open={!!confirmState}
                onClose={() => setConfirmState(null)}
                onConfirm={confirmState?.type === 'approve' ? handleApprove : handleMarkPaid}
                title={
                    confirmState?.type === 'approve'
                        ? t('runs.confirm.approveTitle', { monthYear: confirmState.run ? formatMonthYear(confirmState.run.month, confirmState.run.year, t) : '' })
                        : t('runs.confirm.markPaidTitle', { monthYear: confirmState?.run ? formatMonthYear(confirmState.run.month, confirmState.run.year, t) : '' })
                }
                description={
                    confirmState?.type === 'approve'
                        ? t('runs.confirm.approveDesc')
                        : t('runs.confirm.markPaidDesc')
                }
                confirmLabel={confirmState?.type === 'approve' ? t('runs.confirm.approveBtn') : t('runs.confirm.markPaidBtn')}
            />
        </div>
    );
}