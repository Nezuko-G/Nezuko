import api from "@/lib/axios/core/instance";
import { apis } from "@/lib/api/config";
import type {
    Project,
    Task,
    ProjectProgress,
    OverdueReportGroup,
    CreateProjectPayload,
    UpdateProjectPayload,
    CreateTaskPayload,
    UpdateTaskPayload,
    ProjectFilters,
} from "../types/project.types";

const { projects: p, tasks: t } = apis;

export const projectsApi = {
    /** GET /projects — Manager / HR */
    list: async (filters?: ProjectFilters): Promise<Project[]> => {
        const res = await api.get(p.base, { params: filters });
        const payload = res.data?.projects;
        if (Array.isArray(payload)) return payload;
        return [];
    },
    /** POST /projects — Manager / HR */
    create: async (payload: CreateProjectPayload): Promise<Project> => {
        const res = await api.post(p.base, payload);
        return res.data?.project ?? res.data;
    },

    /** GET /projects/:id — Manager / HR */
    getById: async (id: string): Promise<Project> => {
        const res = await api.get(p.byId(id));
        return res.data?.project ?? res.data;
    },

    /** PATCH /projects/:id — Manager / HR */
    update: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
        const res = await api.patch(p.byId(id), payload);
        return res.data?.project ?? res.data;
    },

    /** GET /projects/:id/progress — Manager / HR */
    getProgress: async (id: string): Promise<ProjectProgress> => {
        const res = await api.get(p.progress(id));
        return res.data?.progress ?? res.data;
    },

    /** GET /projects/:id/tasks — All authenticated */
    listTasks: async (id: string): Promise<Task[]> => {
        const res = await api.get(p.tasks(id));
        const payload = res.data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.tasks)) return payload.tasks;
        return [];
    },
};

export const tasksApi = {
    /** POST /project/tasks — Manager / HR */
    create: async (payload: CreateTaskPayload): Promise<Task> => {
        const res = await api.post(t.base, payload);
        return res.data?.data ?? res.data;
    },

    /** PATCH /project/tasks/:id — Manager / Assignee */
    update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
        const res = await api.patch(t.byId(id), payload);
        return res.data?.data ?? res.data;
    },

    /** PATCH /project/tasks/:id — Assignee (status update) */
    updateStatus: async (id: string, payload: { status: Task["status"] }): Promise<Task> => {
        const res = await api.patch(t.byId(id), payload);
        return res.data?.data ?? res.data;
    },

    /** POST /project/tasks/subtasks/:id — Manager */
    createSubTask: async (parentId: string, payload: CreateTaskPayload): Promise<Task> => {
        const res = await api.post(t.subtasks(parentId), payload);
        return res.data?.data ?? res.data;
    },

    /** GET /project/tasks/:id — All authenticated */
    getById: async (id: string): Promise<Task> => {
        const res = await api.get(t.byId(id));
        return res.data?.data ?? res.data;
    },

    /** GET /project/tasks/me — Employee */
    getMyTasks: async (): Promise<Task[]> => {
        const res = await api.get(t.myTasks);
        const payload = res.data?.data ?? res.data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.tasks)) return payload.tasks;
        return [];
    },

    /** GET /project/tasks/report/overdue — Manager / HR */
    getOverdueReport: async (): Promise<OverdueReportGroup[]> => {
        const res = await api.get(t.overdueReport);
        const payload = res.data?.data ?? res.data;
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.groups)) return payload.groups;
        return [];
    },
};