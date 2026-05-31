'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import api from '@/lib/axios/core/instance';
import { createIncentive } from '../api/payroll.api';
import type { Incentive, IncentiveType } from '../types/payroll.types';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  department?: { name: string } | null;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface AddIncentiveModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (incentive: Incentive) => void;
}

const INCENTIVE_TYPES: IncentiveType[] = ['BONUS', 'COMMISSION', 'OVERTIME', 'DEDUCTION', 'OTHER'];

export const AddIncentiveModal = ({ open, onClose, onSuccess }: AddIncentiveModalProps) => {
  const t = useTranslations('payroll');

  const [form, setForm] = useState({
    userId: '',
    type: 'BONUS' as IncentiveType,
    amount: '',
    description: '',
    effectiveDate: '',
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const res = await api.get('/employee');
        const list: Employee[] =
          res.data?.data?.employees ??
          res.data?.employees ??
          [];
        setEmployees(list);
      } catch {
        setEmployees([]);
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, [open]);

  if (!open) return null;

  const filtered = employees.filter((e) =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectedEmployee = employees.find((e) => e.id === form.userId) ?? null;

  const resetForm = () => {
    setForm({ userId: '', type: 'BONUS', amount: '', description: '', effectiveDate: '' });
    setSearch('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!form.userId || !form.amount || !form.effectiveDate) {
      setError(t('addIncentiveModal.requiredError'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const incentive = await createIncentive({
        userId: form.userId,
        type: form.type,
        amount: parseFloat(form.amount),
        description: form.description || undefined,
        effectiveDate: form.effectiveDate,
      });
      onSuccess(incentive);
      handleClose();
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      setError(apiErr?.response?.data?.message ?? t('addIncentiveModal.genericError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[var(--color-content-dark)]">
            {t('addIncentiveModal.title')}
          </h2>
          <button onClick={handleClose} className="p-2 rounded-xl hover:bg-gray-100 text-[var(--color-content-muted)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-5">

          {/* Employee Selector */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-content-dark)] mb-1.5">
              {t('addIncentiveModal.employee')} <span className="text-red-500">*</span>
            </label>

            {selectedEmployee ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-primary-light)] border border-[var(--color-primary)]">
                <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] text-xs font-bold flex items-center justify-center shrink-0">
                  {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--color-secondary)] truncate">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                  {selectedEmployee.department?.name && (
                    <p className="text-xs text-[var(--color-content-muted)] truncate">
                      {selectedEmployee.department.name}
                      {selectedEmployee.jobTitle ? ` · ${selectedEmployee.jobTitle}` : ''}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setForm((f) => ({ ...f, userId: '' }))}
                  className="p-1 rounded-lg hover:bg-white/60 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="relative mb-2">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t('addIncentiveModal.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
                  />
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-44 overflow-y-auto">
                  {empLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filtered.length === 0 ? (
                    <p className="text-center text-sm text-[var(--color-content-muted)] py-6">
                      {search
                        ? t('addIncentiveModal.noMatch')
                        : t('addIncentiveModal.noEmployees')}
                    </p>
                  ) : (
                    filtered.map((emp) => (
                      <button
                        key={emp.id}
                        onClick={() => {
                          setForm((f) => ({ ...f, userId: emp.id }));
                          setSearch('');
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] text-xs font-bold flex items-center justify-center shrink-0">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--color-content-dark)] truncate">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-[var(--color-content-muted)] truncate">
                            {emp.department?.name ?? t('payslipDetail.noDepartment')}
                            {emp.jobTitle ? ` · ${emp.jobTitle}` : ''}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-content-dark)] mb-1.5">
              {t('addIncentiveModal.type')} <span className="text-red-500">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as IncentiveType }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[var(--color-content-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
            >
              {INCENTIVE_TYPES.map((type) => (
                <option key={type} value={type}>{t(`incentiveType.${type}`)}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-content-dark)] mb-1.5">
              {t('addIncentiveModal.amount')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[var(--color-content-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-content-dark)] mb-1.5">
              {t('addIncentiveModal.description')}
            </label>
            <textarea
              rows={3}
              placeholder={t('addIncentiveModal.descriptionPlaceholder')}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[var(--color-content-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition resize-none"
            />
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-content-dark)] mb-1.5">
              {t('addIncentiveModal.effectiveDate')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.effectiveDate}
              onChange={(e) => setForm((f) => ({ ...f, effectiveDate: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-[var(--color-content-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition"
            />
          </div>
        </div>

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
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-[var(--color-content)] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {t('addIncentiveModal.cancelBtn')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-secondary)] transition-colors disabled:opacity-50"
          >
            {loading ? t('addIncentiveModal.addingBtn') : t('addIncentiveModal.addBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};