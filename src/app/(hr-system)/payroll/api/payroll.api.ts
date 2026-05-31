import api from '@/lib/axios/core/instance';
import type {
    ListRunsFilter,
    ListRunsResponse,
    PayrollRun,
    PayrollRunDetail,
    PayrollEntry,
    CreatePayrollRunInput,
    ListIncentivesFilter,
    ListIncentivesResponse,
    Incentive,
    CreateIncentiveInput,
    SummaryReport,
} from '../types/payroll.types';

// Payroll Runs

export const listPayrollRuns = async (
    filter: ListRunsFilter = {}
): Promise<ListRunsResponse> => {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.year) params.set('year', String(filter.year));
    if (filter.page) params.set('page', String(filter.page));
    if (filter.limit) params.set('limit', String(filter.limit));

    const res = await api.get(`/payrolls/runs?${params}`);
    return res.data.data;
};

export const getPayrollRunById = async (id: string): Promise<PayrollRunDetail> => {
    const res = await api.get(`/payrolls/runs/${id}`);
    return res.data.data;
};

export const createPayrollRun = async (
    input: CreatePayrollRunInput
): Promise<PayrollRun> => {
    const res = await api.post('/payrolls/runs', input);
    return res.data.data;
};

export const approvePayrollRun = async (id: string): Promise<PayrollRun> => {
    const res = await api.patch(`/payrolls/runs/approve/${id}`);
    return res.data.data;
};

export const markPayrollRunPaid = async (id: string): Promise<PayrollRun> => {
    const res = await api.patch(`/payrolls/runs/mark-paid/${id}`);
    return res.data.data;
};

// Payslip

export const getPayslip = async (
    runId: string,
    userId: string
): Promise<PayrollEntry> => {
    const res = await api.get(`/payrolls/runs/entries/${runId}/${userId}`);
    return res.data.data;
};

// Incentives

export const listIncentives = async (
    filter: ListIncentivesFilter = {}
): Promise<ListIncentivesResponse> => {
    const params = new URLSearchParams();
    if (filter.userId) params.set('userId', filter.userId);
    if (filter.type) params.set('type', filter.type);
    if (filter.month) params.set('month', String(filter.month));
    if (filter.year) params.set('year', String(filter.year));
    if (filter.page) params.set('page', String(filter.page));
    if (filter.limit) params.set('limit', String(filter.limit));

    const res = await api.get(`/payrolls/incentives?${params}`);
    return res.data.data;
};

export const createIncentive = async (
    input: CreateIncentiveInput
): Promise<Incentive> => {
    const res = await api.post('/payrolls/incentives', input);
    return res.data.data;
};

export const deleteIncentive = async (id: string): Promise<void> => {
    await api.delete(`/payrolls/incentives/${id}`);
};

// Summary Report

export const getPayrollSummaryReport = async (
    month: number,
    year: number,
    departmentId?: string
): Promise<SummaryReport> => {
    const params = new URLSearchParams();
    params.set('month', String(month));
    params.set('year', String(year));
    if (departmentId) params.set('departmentId', departmentId);

    const res = await api.get(`/payrolls/report/summary?${params}`);
    return res.data.data;
};