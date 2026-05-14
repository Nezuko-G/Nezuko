import { create } from "zustand";
import type { Employee, EmployeeDocument, EmployeeFilters } from "../types";
import { MOCK_EMPLOYEES, MOCK_DOCUMENTS, delay } from "../utils/mock-data";

interface EmployeeStore {
    employees: Employee[];
    selectedEmployee: Employee | null;
    documents: EmployeeDocument[];
    filters: EmployeeFilters;
    isLoading: boolean;
    isDocLoading: boolean;

    fetchEmployees: () => Promise<void>;
    fetchEmployee: (id: string) => Promise<void>;
    createEmployee: (data: Partial<Employee>) => Promise<void>;
    updateEmployee: (id: string, data: Partial<Employee>) => Promise<void>;
    terminateEmployee: (id: string) => Promise<void>;
    fetchDocuments: (employeeId: string) => Promise<void>;
    uploadDocument: (employeeId: string, doc: Omit<EmployeeDocument, "id">) => Promise<void>;
    deleteDocument: (employeeId: string, docId: string) => Promise<void>;
    setFilters: (filters: Partial<EmployeeFilters>) => void;
    setSelectedEmployee: (e: Employee | null) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
    employees: [],
    selectedEmployee: null,
    documents: [],
    filters: { search: "", departmentId: "", status: "" },
    isLoading: false,
    isDocLoading: false,

    fetchEmployees: async () => {
        set({ isLoading: true });
        await delay();
        const { search, departmentId, status } = get().filters;
        let result = [...MOCK_EMPLOYEES];
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (e) =>
                    `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
                    e.email.toLowerCase().includes(q) ||
                    e.employeeCode.toLowerCase().includes(q)
            );
        }
        if (departmentId) result = result.filter((e) => e.department.id === departmentId);
        if (status) result = result.filter((e) => e.status === status);
        set({ employees: result, isLoading: false });
    },

    fetchEmployee: async (id) => {
        set({ isLoading: true });
        await delay();
        const emp = MOCK_EMPLOYEES.find((e) => e.id === id) ?? null;
        set({ selectedEmployee: emp, isLoading: false });
    },

    createEmployee: async (data) => {
        await delay();
        const newEmp: Employee = {
            id: `e${Date.now()}`,
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            email: data.email ?? "",
            employeeCode: data.employeeCode || `EMP-${String(MOCK_EMPLOYEES.length + 1).padStart(3, "0")}`,
            jobTitle: data.jobTitle ?? "",
            department: data.department ?? { id: "", name: "" },
            hireDate: data.hireDate ?? new Date().toISOString().split("T")[0],
            status: "ACTIVE",
            gender: data.gender ?? "OTHER",
        };
        MOCK_EMPLOYEES.unshift(newEmp);
        await get().fetchEmployees();
    },

    updateEmployee: async (id, data) => {
        await delay();
        const idx = MOCK_EMPLOYEES.findIndex((e) => e.id === id);
        if (idx !== -1) Object.assign(MOCK_EMPLOYEES[idx], data);
        set({ selectedEmployee: { ...MOCK_EMPLOYEES[idx] } });
    },

    terminateEmployee: async (id) => {
        await delay();
        const idx = MOCK_EMPLOYEES.findIndex((e) => e.id === id);
        if (idx !== -1) MOCK_EMPLOYEES[idx].status = "TERMINATED";
        set({ selectedEmployee: { ...MOCK_EMPLOYEES[idx] } });
        await get().fetchEmployees();
    },

    fetchDocuments: async (employeeId) => {
        set({ isDocLoading: true });
        await delay();
        set({ documents: MOCK_DOCUMENTS[employeeId] ?? [], isDocLoading: false });
    },

    uploadDocument: async (employeeId, doc) => {
        await delay();
        const newDoc = { ...doc, id: `doc${Date.now()}` };
        if (!MOCK_DOCUMENTS[employeeId]) MOCK_DOCUMENTS[employeeId] = [];
        MOCK_DOCUMENTS[employeeId].unshift(newDoc);
        await get().fetchDocuments(employeeId);
    },

    deleteDocument: async (employeeId, docId) => {
        await delay();
        if (MOCK_DOCUMENTS[employeeId]) {
            MOCK_DOCUMENTS[employeeId] = MOCK_DOCUMENTS[employeeId].filter((d) => d.id !== docId);
        }
        await get().fetchDocuments(employeeId);
    },

    setFilters: (filters) => {
        set((s) => ({ filters: { ...s.filters, ...filters } }));
        get().fetchEmployees();
    },

    setSelectedEmployee: (e) => set({ selectedEmployee: e }),
}));