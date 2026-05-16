import api from "@/lib/axios/core/instance"; 
import type {
    Project,
    Task,
    ProjectProgress,
    OverdueReportGroup,
    CreateProjectPayload,
    UpdateProjectPayload,
    CreateTaskPayload,
    UpdateTaskPayload,
    UpdateTaskStatusPayload,
    ProjectFilters,
} from "../types/project.types";


export const projectsApi = {
    /** GET /projects — Manager / HR */
    list: async (filters?: ProjectFilters): Promise<Project[]> => {
        const res = await api.get("/project", { params: filters });
        const payload = res.data?.data;
        if (Array.isArray(payload)) return payload;
        return [];
    },
    /** POST /projects — Manager / HR */
    create: async (payload: CreateProjectPayload): Promise<Project> => {
        const res = await api.post("/project", payload);
        return res.data?.project ?? res.data;
    },

    /** GET /projects/:id — Manager / HR */
    getById: async (id: string): Promise<Project> => {
        const res = await api.get(`/project/${id}`);
        return res.data?.project ?? res.data;
    },

    /** PATCH /projects/:id — Manager / HR */
    update: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
        const res = await api.patch(`/project/${id}`, payload);
        return res.data?.project ?? res.data;
    },

    /** GET /projects/:id/progress — Manager / HR */
    getProgress: async (id: string): Promise<ProjectProgress> => {
        const res = await api.get(`/project/${id}/progress`);
        return res.data?.progress ?? res.data;
    },

    /** GET /projects/:id/tasks — All authenticated */
    listTasks: async (id: string): Promise<Task[]> => {
        const res = await api.get(`/project/${id}/tasks`);
        const payload = res.data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.tasks)) return payload.tasks;
        return [];
    },
};

export const tasksApi = {
    /** POST /tasks — Manager / HR */
    create: async (payload: CreateTaskPayload): Promise<Task> => {
        const res = await api.post("/tasks", payload);
        return res.data?.data?.task ?? res.data?.task ?? res.data;
    },

    /** PATCH /tasks/:id — Manager / Assignee */
    update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
        const res = await api.patch(`/tasks/${id}`, payload);
        return res.data?.data?.task ?? res.data?.task ?? res.data;
    },

    /** PATCH /tasks/status/:id — Assignee */
    updateStatus: async (id: string, payload: UpdateTaskStatusPayload): Promise<Task> => {
        const res = await api.patch(`/tasks/status/${id}`, payload);
        return res.data?.data?.task ?? res.data?.task ?? res.data;
    },

    /** POST /tasks/subtasks/:id — Manager */
    createSubTask: async (parentId: string, payload: CreateTaskPayload): Promise<Task> => {
        const res = await api.post(`/tasks/subtasks/${parentId}`, payload);
        return res.data?.data?.task ?? res.data?.task ?? res.data;
    },

    /** GET /tasks/me — Employee */
    getMyTasks: async (): Promise<Task[]> => {
        const res = await api.get("/tasks/me");
        const payload = res.data?.data ?? res.data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.tasks)) return payload.tasks;
        return [];
    },

    /** GET /tasks/report/overdue — Manager / HR */
    getOverdueReport: async (): Promise<OverdueReportGroup[]> => {
        const res = await api.get("/tasks/report/overdue");
        const payload = res.data?.data ?? res.data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.groups)) return payload.groups;
        return [];
    },
};