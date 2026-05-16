
export enum ProjectStatus {
  PLANNING = "PLANNING",
  ACTIVE = "ACTIVE",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
  BLOCKED = "BLOCKED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: "MANAGER" | "HR" | "EMPLOYEE";
}

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  ownerId: string;
  owner?: User;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  tenantId: string;
  projectId?: string;
  project?: Pick<Project, "id" | "name">;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assignee?: User;
  createdById: string;
  createdBy?: User;
  dueDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  parentTaskId?: string;
  parentTask?: Pick<Task, "id" | "title">;
  subTasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  dueDate?: string;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
  status?: ProjectStatus;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  projectId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  parentTaskId?: string;
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>

export interface UpdateTaskStatusPayload {
  status: TaskStatus;
}

export interface ProjectProgress {
  completedCount: number;
  totalCount: number;
  completionPercentage: number;
  overdueCount: number;
  hoursVariance: number;
}

export interface OverdueReportGroup {
  assignee: User;
  tasks: Task[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProjectFilters {
  status?: ProjectStatus;
  page?: number;
  pageSize?: number;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
}