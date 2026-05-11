import { useProjectsStore } from "../stores/employee.store";

export function useProjects() {
    const projects = useProjectsStore((s) => s.projects);
    const selectedProject = useProjectsStore((s) => s.selectedProject);
    const loading = useProjectsStore((s) => s.loading);
    const error = useProjectsStore((s) => s.error);
    const createProject = useProjectsStore((s) => s.createProject);
    const updateProject = useProjectsStore((s) => s.updateProject);
    const cancelProject = useProjectsStore((s) => s.cancelProject);
    const setProjects = useProjectsStore((s) => s.setProjects);
    const setSelectedProject = useProjectsStore((s) => s.setSelectedProject);
    const clearError = useProjectsStore((s) => s.clearError);

    return {
        projects,
        selectedProject,
        loading,
        error,
        createProject,
        updateProject,
        cancelProject,
        setProjects,
        setSelectedProject,
        clearError,
    };
}