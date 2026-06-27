import api from "@/lib/axios/core/instance";
import { apis } from "@/lib/api/config";
import type {
    Project,
    Task,
    User,
    ProjectProgress,
    OverdueReportGroup,
    CreateProjectPayload,
    UpdateProjectPayload,
    CreateTaskPayload,
    UpdateTaskPayload,
    UpdateTaskStatusPayload,
    ProjectFilters,
    PaginatedTasksResponse,
    PaginationMeta,
} from "../types/project.types";

const { projects: p, tasks: t } = apis;

function normalizeUser(u: Record<string, unknown> | undefined | null): User {
    if (!u) return u as unknown as User;
    if (!u.name && (u.firstName || u.lastName)) {
        (u as Record<string, unknown>).name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    }
    return u as unknown as User;
}

function normalizeProject(p: Record<string, unknown>): Project {
    if (p.owner) normalizeUser(p.owner as Record<string, unknown>);
    return p as unknown as Project;
}

function normalizeTask(t: Record<string, unknown>): Task {
    if (t.assignee) normalizeUser(t.assignee as Record<string, unknown>);
    if (t.createdBy) normalizeUser(t.createdBy as Record<string, unknown>);
    if (Array.isArray(t.subTasks)) {
        t.subTasks.forEach((sub: Record<string, unknown>) => normalizeTask(sub));
    }
    return t as unknown as Task;
}

export const projectsApi = {
    /** GET /projects — Manager / HR */
    list: async (filters?: ProjectFilters): Promise<Project[]> => {
        const res = await api.get(p.base, { params: filters });
        const payload = res.data?.data ?? res.data;
        const list: Record<string, unknown>[] = Array.isArray(payload?.projects)
            ? payload.projects
            : Array.isArray(payload)
                ? payload
                : [];
        return list.map(normalizeProject);
    },
    /** POST /projects — Manager / HR */
    create: async (payload: CreateProjectPayload): Promise<Project> => {
        const res = await api.post(p.base, payload);
        return normalizeProject(res.data?.data ?? res.data);
    },

    /** GET /projects/:id — Manager / HR */
    getById: async (id: string): Promise<Project> => {
        const res = await api.get(p.byId(id));
        return normalizeProject(res.data?.data ?? res.data);
    },

    /** PATCH /projects/:id — Manager / HR */
    update: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
        const res = await api.patch(p.byId(id), payload);
        return normalizeProject(res.data?.data ?? res.data);
    },

    /** GET /projects/:id/progress — Manager / HR */
    getProgress: async (id: string): Promise<ProjectProgress> => {
        const res = await api.get(p.progress(id));
        return res.data?.data ?? res.data;
    },

    /** GET /projects/:id/tasks — All authenticated */
    listTasks: async (id: string, page = 1, limit = 10, search?: string): Promise<PaginatedTasksResponse> => {
        const res = await api.get(p.tasks(id), { params: { page, limit, search } });
        const payload = res.data?.data ?? res.data;
        const tasks: Task[] = Array.isArray(payload?.tasks)
            ? payload.tasks.map(normalizeTask)
            : Array.isArray(payload)
                ? payload.map(normalizeTask)
                : [];
        const meta: PaginationMeta = payload?.meta ?? {
            total: tasks.length,
            page,
            limit,
            totalPages: Math.ceil(tasks.length / limit) || 1,
        };
        return { tasks, meta };
    },
};

export const tasksApi = {
    /** POST /project/tasks — Manager / HR */
    create: async (payload: CreateTaskPayload): Promise<Task> => {
        const res = await api.post(t.base, payload);
        return normalizeTask(res.data?.data ?? res.data);
    },

    /** PATCH /project/tasks/:id — Manager / Assignee */
    update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
        const res = await api.patch(t.byId(id), payload);
        return normalizeTask(res.data?.data ?? res.data);
    },

    /** PATCH /project/tasks/:id — Assignee (status update) */
    updateStatus: async (id: string, payload: UpdateTaskStatusPayload): Promise<Task> => {
        const res = await api.patch(t.byId(id), payload);
        return normalizeTask(res.data?.data ?? res.data);
    },

    /** POST /project/tasks/subtasks/:id — Manager */
    createSubTask: async (parentId: string, payload: CreateTaskPayload): Promise<Task> => {
        const res = await api.post(t.subtasks(parentId), payload);
        return normalizeTask(res.data?.data ?? res.data);
    },

    /** GET /project/tasks/:id — All authenticated */
    getById: async (id: string): Promise<Task> => {
        const res = await api.get(t.byId(id));
        return normalizeTask(res.data?.data ?? res.data);
    },

    /** GET /project/tasks/me — Employee */
    getMyTasks: async (): Promise<Task[]> => {
        const res = await api.get(t.myTasks);
        const payload = res.data?.data ?? res.data;
        const list: Record<string, unknown>[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.tasks)
                ? payload.tasks
                : [];
        return list.map(normalizeTask);
    },

    /** GET /project/tasks?assigneeId=:id — Manager / HR */
    getByUser: async (userId: string): Promise<Task[]> => {
        const res = await api.get(t.byUser(userId));
        const payload = res.data?.data ?? res.data;
        const list: Record<string, unknown>[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.tasks)
                ? payload.tasks
                : [];
        return list.map(normalizeTask);
    },

    /** GET /project/tasks/report/overdue — Manager / HR */
    getOverdueReport: async (): Promise<OverdueReportGroup[]> => {
        const res = await api.get(t.overdueReport);
        const payload = res.data?.data ?? res.data;
        const rawGroups: Record<string, unknown>[] = Array.isArray(payload)
            ? payload
            : Array.isArray(payload?.groups)
                ? payload.groups
                : [];

        return rawGroups.map((g) => ({
            assignee: { id: g.assigneeId, name: g.assigneeName } as User,
            tasks: ((g.tasks as Record<string, unknown>[]) ?? []).map((task) => {
                if (task.projectName) {
                    task.project = { name: task.projectName as string };
                    delete task.projectName;
                }
                return normalizeTask(task);
            }),
        })) as OverdueReportGroup[];
    },
};
