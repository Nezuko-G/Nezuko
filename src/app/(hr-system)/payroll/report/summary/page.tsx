'use client';

import { useState } from 'react';
import { getPayrollSummaryReport } from '../../api/payroll.api';
import type { SummaryReport } from '../../types/payroll.types';
import {
  formatCurrency,
  formatMonthYear,
  PageHeader,
  MONTH_NAMES,
} from '../../components/shared';

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

const StatCard = ({ label, value, accent }: { label: string; value: number; accent?: boolean }) => (
  <div className={`rounded-2xl border p-5 ${accent ? 'bg-[var(--color-secondary)] border-[var(--color-secondary-hover)] text-white' : 'bg-white border-gray-100'}`}>
    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${accent ? 'text-gray-400' : 'text-[var(--color-content-muted)]'}`}>{label}</p>
    <p className={`text-2xl font-black ${accent ? 'text-[var(--color-primary)]' : 'text-[var(--color-content-dark)]'}`}>{formatCurrency(value)}</p>
  </div>
);

export default function SummaryReportPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [report, setReport] = useState<SummaryReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const data = await getPayrollSummaryReport(month, year);
      setReport(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No payroll run found for this period.');
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!report) return;
    const headers = ['Department', 'Employees', 'Base Salary', 'Overtime Pay', 'Incentives', 'Deductions', 'Net Salary'];
    const rows = report.departments.map((d) => [
      d.departmentName,
      d.headCount,
      d.totalBaseSalary,
      d.totalOvertimePay,
      d.totalIncentives,
      d.totalDeductions,
      d.totalNet,
    ]);
    const gt = report.grandTotal;
    rows.push(['TOTAL', gt.headCount, gt.totalBaseSalary, gt.totalOvertimePay, gt.totalIncentives, gt.totalDeductions, gt.totalNet]);

    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-report-${formatMonthYear(report.month, report.year).replace(' ', '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Payroll Summary Report"
          subtitle="Monthly cost breakdown grouped by department."
          action={
            report ? (
              <button
                onClick={exportCSV}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-white font-semibold text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            ) : null
          }
        />

        {/* Filter Bar */}
        <div className="flex flex-wrap items-end gap-3 mb-8 bg-white border border-gray-100 rounded-2xl p-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-muted)] mb-1">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[var(--color-content-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            >
              {MONTH_NAMES.slice(1).map((name, i) => (
                <option key={i + 1} value={i + 1}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-content-muted)] mb-1">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-[var(--color-content-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleFetch}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-secondary)] transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {error && (
          <div className="flex gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {report && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              <StatCard label="Total Base" value={report.grandTotal.totalBaseSalary} />
              <StatCard label="Total Overtime" value={report.grandTotal.totalOvertimePay} />
              <StatCard label="Total Incentives" value={report.grandTotal.totalIncentives} />
              <StatCard label="Total Deductions" value={report.grandTotal.totalDeductions} />
              <StatCard label="Total Net" value={report.grandTotal.totalNet} accent />
            </div>

            {/* Department Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-[var(--color-content-dark)]">
                  {formatMonthYear(report.month, report.year)} — By Department
                </h2>
                <span className="text-xs text-[var(--color-content-muted)]">{report.grandTotal.headCount} employees</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {['Department', 'Employees', 'Base Salary', 'Overtime', 'Incentives', 'Deductions', 'Net Salary'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--color-content-muted)] uppercase tracking-wide whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.departments.map((dept) => (
                      <tr key={dept.departmentId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 font-semibold text-[var(--color-content-dark)]">{dept.departmentName}</td>
                        <td className="px-4 py-3.5 text-[var(--color-content-muted)]">{dept.headCount}</td>
                        <td className="px-4 py-3.5 text-[var(--color-content)]">{formatCurrency(dept.totalBaseSalary)}</td>
                        <td className="px-4 py-3.5 text-emerald-600">{formatCurrency(dept.totalOvertimePay)}</td>
                        <td className="px-4 py-3.5 text-emerald-600">{formatCurrency(dept.totalIncentives)}</td>
                        <td className="px-4 py-3.5 text-red-500">{formatCurrency(dept.totalDeductions)}</td>
                        <td className="px-4 py-3.5 font-bold text-[var(--color-primary-hover)]">{formatCurrency(dept.totalNet)}</td>
                      </tr>
                    ))}
                    {/* Grand Total row */}
                    <tr className="bg-[var(--color-secondary)] text-white">
                      <td className="px-4 py-3.5 font-bold">Total</td>
                      <td className="px-4 py-3.5 font-bold">{report.grandTotal.headCount}</td>
                      <td className="px-4 py-3.5 font-bold">{formatCurrency(report.grandTotal.totalBaseSalary)}</td>
                      <td className="px-4 py-3.5 font-bold text-[var(--color-primary)]">{formatCurrency(report.grandTotal.totalOvertimePay)}</td>
                      <td className="px-4 py-3.5 font-bold text-[var(--color-primary)]">{formatCurrency(report.grandTotal.totalIncentives)}</td>
                      <td className="px-4 py-3.5 font-bold text-red-300">{formatCurrency(report.grandTotal.totalDeductions)}</td>
                      <td className="px-4 py-3.5 font-black text-[var(--color-primary)]">{formatCurrency(report.grandTotal.totalNet)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}