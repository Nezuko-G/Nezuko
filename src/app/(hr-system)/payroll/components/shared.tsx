'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PayrollStatus, IncentiveType } from '../types/payroll.types';


const statusStyles: Record<PayrollStatus, string> = {
    DRAFT: 'bg-gray-100 text-gray-600 border border-gray-200',
    APPROVED: 'bg-blue-50 text-blue-700 border border-blue-200',
    PAID: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export const PayrollStatusBadge = ({ status }: { status: PayrollStatus }) => {
    const t = useTranslations('payroll');
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status]}`}
        >
            {t(`status.${status}`)}
        </span>
    );
};


const incentiveStyles: Record<IncentiveType, string> = {
    BONUS: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    COMMISSION: 'bg-blue-50 text-blue-700 border border-blue-200',
    OVERTIME: 'bg-orange-50 text-orange-700 border border-orange-200',
    DEDUCTION: 'bg-red-50 text-red-700 border border-red-200',
    OTHER: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export const IncentiveTypeBadge = ({ type }: { type: IncentiveType }) => {
    const t = useTranslations('payroll');
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${incentiveStyles[type]}`}
        >
            {t(`incentiveType.${type}`)}
        </span>
    );
};


export const PayrollLockBanner = ({ status }: { status: PayrollStatus }) => {
    const t = useTranslations('payroll');
    if (status === 'DRAFT') return null;
    return (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium mb-6">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t('shared.lockBanner')}
        </div>
    );
};


interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    description: string;
    confirmLabel?: string;
    confirmVariant?: 'primary' | 'danger';
}

export const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel,
    confirmVariant = 'primary',
}: ConfirmModalProps) => {
    const t = useTranslations('payroll');
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    const btnClass =
        confirmVariant === 'danger'
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-secondary)]';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">
                <h3 className="text-lg font-bold text-content-dark mb-2">{title}</h3>
                <p className="text-sm text-content-muted mb-6">{description}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-content hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {t('shared.confirmModal.cancel')}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${btnClass}`}
                    >
                        {loading ? t('shared.confirmModal.processing') : (confirmLabel || t('shared.confirmModal.confirm'))}
                    </button>
                </div>
            </div>
        </div>
    );
};


interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Drawer = ({ open, onClose, title, children }: DrawerProps) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-content-dark">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-gray-100 text-content-muted transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};


export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);


export const MONTH_NAMES = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatMonthYear = (month: number, year: number, t?: any) => {
    if (t) {
        return `${t(`months.${month}`)} ${year}`;
    }
    return `${MONTH_NAMES[month]} ${year}`;
};


export const PageHeader = ({
    title,
    subtitle,
    action,
}: {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}) => (
    <div className="flex items-start justify-between mb-8">
        <div>
            <h1 className="text-2xl font-bold text-content-dark tracking-tight">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-content-muted">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
    </div>
);


export const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-16 text-content-muted">
        <svg className="w-12 h-12 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">{message}</p>
    </div>
);


export const TableSkeleton = ({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) => (
    <div className="animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-gray-50">
                {Array.from({ length: cols }).map((_, j) => (
                    <div key={j} className="h-4 bg-gray-100 rounded flex-1" />
                ))}
            </div>
        ))}
    </div>
);


export const NetSalaryCell = ({ amount }: { amount: number }) => (
    <span className="font-bold text-primary-hover">{formatCurrency(amount)}</span>
);