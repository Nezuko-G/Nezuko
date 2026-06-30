import { z } from "zod";

interface DepartmentShape {
  id: string;
  name: string;
  description?: string | null;
  managerId?: string | null;
  manager?: { id: string; firstName: string; lastName: string } | null;
  parentId?: string | null;
  parent?: { id: string; name: string } | null;
  employeeCount: number;
  subDepartmentsCount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  children?: DepartmentShape[];
}

export const DepartmentDTO: z.ZodType<DepartmentShape> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  managerId: z.string().nullable().optional(),
  manager: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }).nullable().optional(),
  parentId: z.string().nullable().optional(),
  parent: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable().optional(),
  employeeCount: z.number().default(0),
  subDepartmentsCount: z.number().default(0),
  status: z.string().default("ACTIVE"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  children: z.lazy(() => z.array(DepartmentDTO)).optional(),
});

export type Department = z.infer<typeof DepartmentDTO>;

export const CreateDepartmentDTO = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  managerId: z.string().optional(),
  parentId: z.string().optional(),
});

export const UpdateDepartmentDTO = CreateDepartmentDTO.partial();
