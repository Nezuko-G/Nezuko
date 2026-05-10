import { create } from "zustand";
import {
    Project,
    CreateProjectDTO,
    UpdateProjectDTO,
} from "../types/project.types";

interface ProjectsState {
    projects: Project[];
    selectedProject: Project | null;
    loading: boolean;
    error: string | null;

    setProjects: (projects: Project[]) => void;
    setSelectedProject: (project: Project) => void;
    clearError: () => void;

    // actions
    createProject: (data: CreateProjectDTO) => Promise<boolean>;
    updateProject: (id: string, data: UpdateProjectDTO) => Promise<boolean>;
    cancelProject: (id: string) => Promise<boolean>;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,

    setProjects: (projects) => set({ projects }),
    setSelectedProject: (project) => set({ selectedProject: project }),
    clearError: () => set({ error: null }),

    createProject: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                set({ error: body.message ?? "Failed to create project" });
                return false;
            }

            const created: Project = await res.json();
            set((s) => ({ projects: [created, ...s.projects] }));
            return true;
        } catch {
            set({ error: "Network error, please try again" });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    updateProject: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                set({ error: body.message ?? "Failed to update project" });
                return false;
            }

            const updated: Project = await res.json();
            set((s) => ({
                projects: s.projects.map((p) => (p.id === id ? updated : p)),
                selectedProject:
                    s.selectedProject?.id === id ? updated : s.selectedProject,
            }));
            return true;
        } catch {
            set({ error: "Network error, please try again" });
            return false;
        } finally {
            set({ loading: false });
        }
    },

    cancelProject: async (id) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "CANCELLED" }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                set({ error: body.message ?? "Failed to cancel project" });
                return false;
            }

            const updated: Project = await res.json();
            set((s) => ({
                projects: s.projects.map((p) => (p.id === id ? updated : p)),
            }));
            return true;
        } catch {
            set({ error: "Network error, please try again" });
            return false;
        } finally {
            set({ loading: false });
        }
    },
}));