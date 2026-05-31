export type PayrollStatus = 'DRAFT' | 'APPROVED' | 'PAID';
export type IncentiveType = 'BONUS' | 'COMMISSION' | 'OVERTIME' | 'DEDUCTION' | 'OTHER';

export interface UserRef {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface PayrollRun {
    id: string;
    tenantId: string;
    month: number;
    year: number;
    status: PayrollStatus;
    createdBy: string;
    approvedBy: string | null;
    approvedAt: string | null;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
    creator: UserRef;
    approver: UserRef | null;
    _count: { entries: number };
}

export interface PayrollRunDetail extends PayrollRun {
    entries: PayrollEntry[];
}

export interface PayrollEntry {
    id: string;
    payrollRunId: string;
    tenantId: string;
    userId: string;
    baseSalary: number;
    overtimePay: number;
    totalIncentives: number;
    totalDeductions: number;
    insuranceAmount: number;
    netSalary: number;
    overtimeHours: number;
    createdAt: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        employeeCode: string;
        jobTitle: string;
        department: { id: string; name: string } | null;
    };
    incentives: EntryIncentive[];
}

export interface EntryIncentive {
    id: string;
    type: IncentiveType;
    amount: number;
    description: string | null;
    effectiveDate: string;
}

export interface Incentive {
    id: string;
    tenantId: string;
    userId: string;
    payrollEntryId: string | null;
    type: IncentiveType;
    amount: number;
    description: string | null;
    effectiveDate: string;
    createdBy: string;
    createdAt: string;
    user: UserRef;
    creator: { id: string; firstName: string; lastName: string };
    payrollEntry: { id: string; payrollRunId: string } | null;
}

export interface PaginatedMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ListRunsResponse {
    payrollRuns: PayrollRun[];
    meta: PaginatedMeta;
}

export interface ListIncentivesResponse {
    incentives: Incentive[];
    meta: PaginatedMeta;
}

export interface SummaryDepartment {
    departmentId: string;
    departmentName: string;
    totalBaseSalary: number;
    totalOvertimePay: number;
    totalIncentives: number;
    totalDeductions: number;
    totalNet: number;
    headCount: number;
}

export interface SummaryReport {
    runId: string;
    status: PayrollStatus;
    month: number;
    year: number;
    departments: SummaryDepartment[];
    grandTotal: {
        totalBaseSalary: number;
        totalOvertimePay: number;
        totalIncentives: number;
        totalDeductions: number;
        totalNet: number;
        headCount: number;
    };
}

// Filter / Input types
export interface ListRunsFilter {
    status?: PayrollStatus;
    year?: number;
    page?: number;
    limit?: number;
}

export interface CreatePayrollRunInput {
    month: number;
    year: number;
}

export interface ListIncentivesFilter {
    userId?: string;
    type?: IncentiveType;
    month?: number;
    year?: number;
    page?: number;
    limit?: number;
}

export interface CreateIncentiveInput {
    userId: string;
    type: IncentiveType;
    amount: number;
    description?: string;
    effectiveDate: string;
}