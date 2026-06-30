'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createPayrollRun } from '../api/payroll.api';
import type { PayrollRun } from '../types/payroll.types';

interface CreatePayrollRunModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (run: PayrollRun) => void;
}

export const CreatePayrollRunModal = ({ open, onClose, onSuccess }: CreatePayrollRunModalProps) => {
  const t = useTranslations('payroll');
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const run = await createPayrollRun({ month, year });
      onSuccess(run);
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        setError(t('createRunModal.conflictError'));
      } else {
        setError(err?.response?.data?.message || t('createRunModal.genericError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-content-dark">{t('createRunModal.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-content-muted transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info note */}
        <div className="flex gap-2.5 p-3 rounded-xl bg-primary-light border border-primary mb-5">
          <svg className="w-4 h-4 text-primary-hover5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-secondary leading-relaxed">
            {t('createRunModal.infoText')}
          </p>
        </div>

        {/* Fields */}
        <div className="space-y-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-content-dark mb-1.5">{t('createRunModal.month')}</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-content-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>{t(`months.${m}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-content-dark mb-1.5">{t('createRunModal.year')}</label>
            <input
              type="number"
              value={year}
              min={2020}
              max={currentYear + 2}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-content-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-content hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t('createRunModal.cancelBtn')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-primary hover:bg-primary-hover text-secondary transition-colors disabled:opacity-50"
          >
            {loading ? t('createRunModal.creatingBtn') : t('createRunModal.createBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};