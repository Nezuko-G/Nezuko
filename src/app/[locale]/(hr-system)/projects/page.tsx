import { ProjectList } from "./_components/ProjectList";
import { Project } from "./types/project.types";

async function fetchProjects(): Promise<Project[]> {
    const res = await fetch(`http://localhost:5000/api/v1/project`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!res.ok) return [];
    
    const json = await res.json();
    return json.data.projects; 
}

export default async function ProjectsPage() {
    const projects = await fetchProjects();

    console.log(projects);


    return (
        <div className="p-6">
            <ProjectList initialProjects={projects} />
        </div>
    );
}