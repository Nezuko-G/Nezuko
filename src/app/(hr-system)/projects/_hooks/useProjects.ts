"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    type UseQueryOptions,
} from "@tanstack/react-query";
import { projectsApi } from "../api/api";
import type {
    Project,
    Task,
    ProjectProgress,
    CreateProjectPayload,
    UpdateProjectPayload,
    ProjectFilters,
    PaginatedResponse,
    PaginatedTasksResponse,
} from "../types/project.types";
import { ProjectStatus } from "../types/project.types";


export const projectKeys = {
    all: ["projects"] as const,
    list: (filters?: ProjectFilters) => [...projectKeys.all, "list", filters] as const,
    detail: (id: string) => [...projectKeys.all, "detail", id] as const,
    progress: (id: string) => [...projectKeys.all, "progress", id] as const,
    tasks: (id: string) => [...projectKeys.all, "tasks", id] as const,
};


export function useProjects(
    filters?: ProjectFilters,
    options?: UseQueryOptions<Project[]>
) {
    return useQuery({
        queryKey: projectKeys.list(filters),
        queryFn: () => projectsApi.list(filters),
        ...options,
    });
}


export function useProject(
    id: string,
    options?: UseQueryOptions<Project>
) {
    return useQuery({
        queryKey: projectKeys.detail(id),
        queryFn: () => projectsApi.getById(id),
        enabled: !!id,
        ...options,
    });
}


export function useProjectProgress(
    id: string,
    options?: UseQueryOptions<ProjectProgress>
) {
    return useQuery({
        queryKey: projectKeys.progress(id),
        queryFn: () => projectsApi.getProgress(id),
        enabled: !!id,
        ...options,
    });
}


export function useProjectTasks(
    projectId: string,
    page = 1,
    limit = 10,
    search?: string,
    options?: UseQueryOptions<PaginatedTasksResponse>
) {
    return useQuery({
        queryKey: [...projectKeys.tasks(projectId), page, search],
        queryFn: () => projectsApi.listTasks(projectId, page, limit, search),
        enabled: !!projectId,
        ...options,
    });
}


export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateProjectPayload) => projectsApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectKeys.all });
        },
    });
}


export function useUpdateProject(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateProjectPayload) => projectsApi.update(id, payload),
        onSuccess: (updated) => {
            queryClient.setQueryData(projectKeys.detail(id), updated);
            queryClient.invalidateQueries({ queryKey: projectKeys.list() });
        },
    });
}


export function useCancelProject(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            projectsApi.update(id, { status: ProjectStatus.CANCELLED }),
        onSuccess: (updated) => {
            queryClient.setQueryData(projectKeys.detail(id), updated);
            queryClient.invalidateQueries({ queryKey: projectKeys.tasks(id) });
            queryClient.invalidateQueries({ queryKey: projectKeys.list() });
        },
    });
}