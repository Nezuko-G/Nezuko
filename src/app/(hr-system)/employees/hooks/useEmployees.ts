"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllEmployees,
    getEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from "../api/employees.api";
import type {
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
} from "@/app/(hr-system)/employees/types/employees.dto";
import { useToast } from "@/components/ui/toast";

interface ApiErrorType extends Error {
    status?: number;
}

const EMPLOYEES_KEY = ["employees"] as const;
const employeeKey = (id: string) => [...EMPLOYEES_KEY, id] as const;

export function useEmployees(params?: { page?: number; limit?: number; search?: string; departmentId?: string; status?: string }) {
    const toast = useToast();

    return useQuery({
        queryKey: [EMPLOYEES_KEY, params],
        queryFn: async () => {
            try {
                return await getAllEmployees(params);
            } catch (error) {
                const err = error as ApiErrorType;
                toast.error(err?.message || "Failed to load employees");
                throw error;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}


export function useEmployee(id: string) {
    const toast = useToast();

    return useQuery({
        queryKey: employeeKey(id),
        queryFn: async () => {
            try {
                return await getEmployee(id);
            } catch (error) {
                const err = error as ApiErrorType;
                toast.error(err?.message || "Failed to load employee");
                throw error;
            }
        },
        enabled: !!id,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateEmployee() {
    const toast = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateEmployeeRequest) => createEmployee(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
            toast.success("Employee created successfully");
        },
        onError: (error: ApiErrorType) => {
            toast.error(error?.message || "Failed to create employee");
        },
    });
}


export function useUpdateEmployee(id: string) {
    const toast = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateEmployeeRequest) => updateEmployee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
            queryClient.invalidateQueries({ queryKey: employeeKey(id) });
            toast.success("Employee updated successfully");
        },
        onError: (error: ApiErrorType) => {
            toast.error(error?.message || "Failed to update employee");
        },
    });
}


export function useDeleteEmployee() {
    const toast = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: EMPLOYEES_KEY });
            toast.success("Employee deleted successfully");
        },
        onError: (error: ApiErrorType) => {
            toast.error(error?.message || "Failed to delete employee");
        },
    });
}