'use client';

import { useTranslations } from 'next-intl';
import { formatCurrency, formatMonthYear } from './shared';
import type { PayrollEntry } from '../types/payroll.types';

interface PayslipDetailProps {
  entry: PayrollEntry;
  month: number;
  year: number;
}

export const PayslipDetail = ({ entry, month, year }: PayslipDetailProps) => {
  const t = useTranslations('payroll');
  const bonuses = entry.incentives.filter((i) => i.type !== 'DEDUCTION');
  const deductions = entry.incentives.filter((i) => i.type === 'DEDUCTION');

  return (
    <div className="space-y-5">
      {/* Employee Info */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary text-white">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-secondary font-bold text-sm shrink-0">
          {entry.user.firstName[0]}{entry.user.lastName[0]}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{entry.user.firstName} {entry.user.lastName}</p>
          <p className="text-xs text-gray-400 truncate">{entry.user.department?.name ?? t('payslipDetail.noDepartment')} · {formatMonthYear(month, year, t)}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
        <LineItem label={t('payslipDetail.baseSalary')} value={entry.baseSalary} />

        {/* Overtime */}
        {entry.overtimeHours === 0 ? (
          <div className="px-4 py-3 bg-gray-50">
            <p className="text-xs text-content-muted italic">{t('payslipDetail.noOvertime')}</p>
          </div>
        ) : (
          <LineItem
            label={t('payslipDetail.overtime', { hours: entry.overtimeHours })}
            value={entry.overtimePay}
            positive
          />
        )}

        {/* Incentive items */}
        {bonuses.length > 0 && (
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-content-muted uppercase tracking-wide mb-2">{t('payslipDetail.incentives')}</p>
            {bonuses.map((inc) => (
              <div key={inc.id} className="flex justify-between text-sm py-1">
                <span className="text-content">{t(`incentiveType.${inc.type}`)}{inc.description ? ` — ${inc.description}` : ''}</span>
                <span className="text-emerald-600 font-medium">+{formatCurrency(inc.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Deduction items */}
        {deductions.length > 0 && (
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-content-muted uppercase tracking-wide mb-2">{t('payslipDetail.deductions')}</p>
            {deductions.map((inc) => (
              <div key={inc.id} className="flex justify-between text-sm py-1">
                <span className="text-content">{inc.description || t('incentiveType.DEDUCTION')}</span>
                <span className="text-red-500 font-medium">-{formatCurrency(inc.amount)}</span>
              </div>
            ))}
          </div>
        )}

        <LineItem label={t('payslipDetail.insurance')} value={-entry.insuranceAmount} negative />
      </div>

      {/* Net Salary */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-light border border-primary">
        <span className="text-sm font-bold text-secondary">{t('payslipDetail.netSalary')}</span>
        <span className="text-2xl font-black text-primary-hover">{formatCurrency(entry.netSalary)}</span>
      </div>
    </div>
  );
};

const LineItem = ({
  label,
  value,
  positive,
  negative,
}: {
  label: string;
  value: number;
  positive?: boolean;
  negative?: boolean;
}) => {
  const color = negative
    ? 'text-red-500'
    : positive
    ? 'text-emerald-600'
    : 'text-[var(--color-content-dark)]';
  const prefix = negative ? '-' : positive ? '+' : '';
  const displayValue = Math.abs(value);

  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-sm text-content">{label}</span>
      <span className={`text-sm font-semibold ${color}`}>
        {prefix}{formatCurrency(displayValue)}
      </span>
    </div>
  );
};