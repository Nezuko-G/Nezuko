'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getPayrollRunById, getPayslip } from '../../../../api/payroll.api';
import type { PayrollRunDetail, PayrollEntry } from '../../../../types/payroll.types';
import { PayslipDetail } from '../../../../components/PayslipDetail';
import { PayrollLockBanner, formatMonthYear, PageHeader } from '../../../../components/shared';

export default function PayslipPage() {
  const t = useTranslations('payroll');
  const { id, userId } = useParams<{ id: string; userId: string }>();
  const [run, setRun] = useState<PayrollRunDetail | null>(null);
  const [entry, setEntry] = useState<PayrollEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const [runData, entryData] = await Promise.all([
          getPayrollRunById(id),
          getPayslip(id, userId),
        ]);
        setRun(runData);
        setEntry(entryData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Could not load payslip.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !entry || !run) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <p className="text-[var(--color-content-muted)]">{error || 'Payslip not found.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 lg:p-8">
      <div className="max-w-lg mx-auto">
        <PageHeader
          title={t('runDetail.payslipTitle', { monthYear: formatMonthYear(run.month, run.year, t) })}
          subtitle={t('runDetail.payslipSubtitle')}
        />
        <PayrollLockBanner status={run.status} />
        <PayslipDetail entry={entry} month={run.month} year={run.year} />
      </div>
    </div>
  );
}
