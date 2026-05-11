export type EmployeeStatus = "ACTIVE" | "TERMINATED";
export type EmployeeGender = "MALE" | "FEMALE" | "OTHER";
export type DocumentExpiryStatus = "EXPIRED" | "EXPIRING_SOON" | "OK";

export interface Department {
    id: string;
    name: string;
}

export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    employeeCode: string;
    jobTitle: string;
    department: Department;
    hireDate: string;
    status: EmployeeStatus;
    gender: EmployeeGender;
    phone?: string;
    avatarUrl?: string;
    address?: Address;
    emergencyContact?: EmergencyContact;
}

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export interface EmergencyContact {
    name?: string;
    relationship?: string;
    phone?: string;
}

export interface EmployeeDocument {
    id: string;
    fileName: string;
    type: string;
    uploadedAt: string;
    expiryDate?: string;
    expiryStatus?: DocumentExpiryStatus;
    url: string;
}

export interface EmployeeFilters {
    search: string;
    departmentId: string;
    status: EmployeeStatus | "";
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}