"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { tasksApi } from "../api/api";
import { projectKeys } from "./useProjects";
import type {
    Task,
    OverdueReportGroup,
    CreateTaskPayload,
    UpdateTaskPayload,
    UpdateTaskStatusPayload,
} from "../types/project.types";


export const taskKeys = {
    all: ["tasks"] as const,
    byId: (id: string) => [...taskKeys.all, id] as const,
    myTasks: () => [...taskKeys.all, "me"] as const,
    overdueReport: () => [...taskKeys.all, "report", "overdue"] as const,
};


export function useTaskById(id: string, options?: UseQueryOptions<Task>) {
    return useQuery({
        queryKey: taskKeys.byId(id),
        queryFn: () => tasksApi.getById(id),
        enabled: !!id,
        ...options,
    });
}


export function useMyTasks(options?: UseQueryOptions<Task[]>) {
    return useQuery({
        queryKey: taskKeys.myTasks(),
        queryFn: tasksApi.getMyTasks,
        ...options,
    });
}


export function useOverdueReport(options?: UseQueryOptions<OverdueReportGroup[]>) {
    return useQuery({
        queryKey: taskKeys.overdueReport(),
        queryFn: tasksApi.getOverdueReport,
        ...options,
    });
}


export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTaskPayload) => tasksApi.create(payload),
        onSuccess: (task) => {
            if (task.projectId) {
                queryClient.invalidateQueries({
                    queryKey: projectKeys.tasks(task.projectId),
                });
                queryClient.invalidateQueries({
                    queryKey: projectKeys.progress(task.projectId),
                });
            }
            queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
        },
    });
}


export function useUpdateTask(taskId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateTaskPayload) => tasksApi.update(taskId, payload),
        onSuccess: (task) => {
            if (task.projectId) {
                queryClient.invalidateQueries({
                    queryKey: projectKeys.tasks(task.projectId),
                });
                queryClient.invalidateQueries({
                    queryKey: projectKeys.progress(task.projectId),
                });
            }
            queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
        },
    });
}


export function useUpdateTaskStatus(taskId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateTaskStatusPayload) =>
            tasksApi.updateStatus(taskId, payload),
        onSuccess: (task) => {
            if (task.projectId) {
                queryClient.invalidateQueries({
                    queryKey: projectKeys.tasks(task.projectId),
                });
                queryClient.invalidateQueries({
                    queryKey: projectKeys.progress(task.projectId),
                });
            }
            queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
        },
    });
}


export function useCreateSubTask(parentId: string, options?: { parentDepth?: number }) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateTaskPayload) => {
            if (options?.parentDepth !== undefined && options.parentDepth > 0) {
                throw new Error("Sub-tasks cannot have nested sub-tasks");
            }
            return tasksApi.createSubTask(parentId, payload);
        },
        onSuccess: (task) => {
            if (task.projectId) {
                queryClient.invalidateQueries({
                    queryKey: projectKeys.tasks(task.projectId),
                });
            }
            queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
        },
    });
}