import { apis } from "@/lib/api/config";
import api from "@/lib/axios/core/instance";

export interface ProfileData {
    id: string;
    tenantId: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    hireDate?: string | null;
    jobTitle?: string | null;
    employeeCode?: string | null;
    status?: string | null;
    departmentId?: string | null;
    salary?: number | null;
    country?: string | null;
    city?: string | null;
    address?: string | null;
    emergencyName?: string | null;
    emergencyPhone?: string | null;
    emergencyRelation?: string | null;
}

export async function getMe(): Promise<ProfileData> {
    const response = await api.get(apis.auth.me);
    return response.data.data as ProfileData;
}
