'use client';

import { useEffect, useState } from 'react';
import { listPayrollRuns, getPayslip } from '../api/payroll.api';
import type { PayrollRun, PayrollEntry } from '../types/payroll.types';
import {
  PayrollStatusBadge,
  Drawer,
  formatMonthYear,
  formatCurrency,
  NetSalaryCell,
  PageHeader,
  EmptyState,
  TableSkeleton,
} from '../components/shared';
import { PayslipDetail } from '../components/PayslipDetail';

// NOTE: In real usage, replace `CURRENT_USER_ID` with the actual user ID from auth context.
// e.g. const { user } = useAuth(); const userId = user.id;
const CURRENT_USER_ID = 'REPLACE_WITH_AUTH_USER_ID';

export default function MyPayslipPage() {
  const [runs, setRuns] = useState<PayrollRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<PayrollRun | null>(null);
  const [entry, setEntry] = useState<PayrollEntry | null>(null);
  const [entryLoading, setEntryLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState<number | 'ALL'>('ALL');

  useEffect(() => {
    const fetchRuns = async () => {
      setLoading(true);
      try {
        const res = await listPayrollRuns({ status: 'APPROVED', limit: 100 });
        // Also include PAID runs
        const paidRes = await listPayrollRuns({ status: 'PAID', limit: 100 });
        const combined = [...res.payrollRuns, ...paidRes.payrollRuns].sort(
          (a, b) => b.year - a.year || b.month - a.month
        );
        setRuns(combined);
      } finally {
        setLoading(false);
      }
    };
    fetchRuns();
  }, []);

  const handleRowClick = async (run: PayrollRun) => {
    setSelectedRun(run);
    setEntry(null);
    setEntryLoading(true);
    try {
      const e = await getPayslip(run.id, CURRENT_USER_ID);
      setEntry(e);
    } catch {
      setEntry(null);
    } finally {
      setEntryLoading(false);
    }
  };

  const availableYears = Array.from(new Set(runs.map((r) => r.year))).sort((a, b) => b - a);

  const filtered = runs.filter((r) => yearFilter === 'ALL' || r.year === yearFilter);

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="My Payslips"
          subtitle="View your monthly salary breakdown. Read-only."
        />

        {/* Year filter */}
        {availableYears.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            <button
              onClick={() => setYearFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${yearFilter === 'ALL' ? 'bg-[var(--color-secondary)] text-white' : 'bg-white border border-gray-200 text-[var(--color-content-muted)] hover:border-gray-300'}`}
            >
              All Years
            </button>
            {availableYears.map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors ${yearFilter === y ? 'bg-[var(--color-secondary)] text-white' : 'bg-white border border-gray-200 text-[var(--color-content-muted)] hover:border-gray-300'}`}
              >
                {y}
              </button>
            ))}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {['Month / Year', 'Base Salary', 'Net Salary', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-content-muted)] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-2">
                      <TableSkeleton rows={4} cols={4} />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <EmptyState message="No payslips available yet." />
                    </td>
                  </tr>
                ) : (
                  filtered.map((run) => (
                    <tr
                      key={run.id}
                      onClick={() => handleRowClick(run)}
                      className="border-b border-gray-50 hover:bg-gray-50/60 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3.5 font-semibold text-[var(--color-content-dark)]">
                        {formatMonthYear(run.month, run.year)}
                      </td>
                      <td className="px-4 py-3.5 text-[var(--color-content)]">—</td>
                      <td className="px-4 py-3.5">—</td>
                      <td className="px-4 py-3.5">
                        <PayrollStatusBadge status={run.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs text-[var(--color-content-muted)] text-center">
          Click any row to view your full payslip breakdown.
        </p>
      </div>

      {/* Drawer */}
      <Drawer
        open={!!selectedRun}
        onClose={() => { setSelectedRun(null); setEntry(null); }}
        title={selectedRun ? `Payslip — ${formatMonthYear(selectedRun.month, selectedRun.year)}` : 'Payslip'}
      >
        {entryLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!entryLoading && entry && selectedRun && (
          <PayslipDetail entry={entry} month={selectedRun.month} year={selectedRun.year} />
        )}
        {!entryLoading && !entry && selectedRun && (
          <EmptyState message="No payslip entry found for this period." />
        )}
      </Drawer>
    </div>
  );
}