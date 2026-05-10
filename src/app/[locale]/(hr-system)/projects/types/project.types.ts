export type ProjectStatus =
  | "PLANNING"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export interface ProjectOwner {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  ownerId: string;
  owner: ProjectOwner;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  status?: ProjectStatus;
}