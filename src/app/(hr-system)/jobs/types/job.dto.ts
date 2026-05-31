import { z } from "zod";

export const BilingualStringDTO = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const JobTextItemDTO = z.object({
  text: BilingualStringDTO,
});

export const CreateJobDTO = z.object({
  title: BilingualStringDTO,
  description: BilingualStringDTO,
  locationDetails: BilingualStringDTO,
  duration: BilingualStringDTO,
  jobId: z.string().min(1),
  company: z.string().min(1),
  organization: z.string().min(1),
  fieldOfWork: z.string().min(1),
  experienceLevel: z.string().min(1),
  keywords: z.array(z.string()),
  jobType: z.enum(["full-time", "part-time", "contract", "freelance"]),
  employmentType: z.enum(["permanent", "temporary", "internship"]),
  responsibilities: z.array(JobTextItemDTO),
  requirements: z.array(JobTextItemDTO),
  country: z.string().min(1),
  workMode: z.enum(["remote", "hybrid", "on-site"]),
  expirationDate: z.string().datetime(),
});

export type CreateJobInput = z.infer<typeof CreateJobDTO>;

export const JobLoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type JobLoginInput = z.infer<typeof JobLoginDTO>;

export interface JobResponse {
  _id: string;
  title: string;
  description: string;
  locationDetails: string;
  duration: string;
  slug: string;
  jobId: string;
  company: string;
  organization: string;
  jobType: string;
  employmentType: string;
  workMode: string;
  expirationDate: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  fieldOfWork?: { name: string; _id: string } | null;
  experienceLevel?: { title: string; _id: string } | null;
  country?: { name: string; _id: string } | null;
  keywords?: { word: string; _id: string }[];
  responsibilities?: { text: string; _id: string }[];
  requirements?: { text: string; _id: string }[];
}

export interface JobsPaginatedResponse {
  message: string;
  data: JobResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JobFilters {
  country?: string;
  fieldOfWork?: string;
  experienceLevel?: string;
  jobType?: string;
  workMode?: string;
}

export interface SingleJobResponse {
  message: string;
  data: JobResponse;
}