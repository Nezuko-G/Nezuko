import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocale } from "next-intl";
import { CreateJobInput, JobsPaginatedResponse, SingleJobResponse,JobFilters } from "../types/job.dto";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const jobsClient = axios.create({
  baseURL: "/api/jobs-proxy",
});

export const useJobsAuthCheck = () => {
  return useQuery({
    queryKey: ["jobs_auth_check"],
    queryFn: async () => {
      const res = await jobsClient.get<{ isAuthenticated: boolean }>("/check-auth");
      return res.data;
    },
    retry: false,
  });
};

export const useJobsAuth = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await jobsClient.post("/auth/login", data);
      return res.data;
    },
  });
};

export const useJobsList = (
  page: number, 
  limit: number, 
  lang: string, 
  search?: string, 
  filters?: JobFilters
) => {
  return useQuery({
    queryKey: ["jobs", page, limit, lang, search, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search && search.trim() !== "" && search !== "undefined" && search !== "null") {
        params.append("search", search.trim());
      }

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value && value !== "all" && value.trim() !== "") {
            params.append(key, value.trim());
          }
        });
      }

      const res = await jobsClient.get<JobsPaginatedResponse>(`/job?${params.toString()}`, {
        headers: { "Accept-Language": lang },
      });
      return res.data;
    },
    retry: false,
  });
};
export const useJobBilingual = (id: string) => {
  return useQuery({
    queryKey: ["job_bilingual_final", id], 
    queryFn: async () => {
      const [arRes, enRes] = await Promise.all([
        jobsClient.get(`/job/${id}`, { 
          params: { lang: "ar", t: Date.now() },
          headers: { "Accept-Language": "ar" } 
        }),
        jobsClient.get(`/job/${id}`, { 
          params: { lang: "en", t: Date.now() },
          headers: { "Accept-Language": "en" } 
        }),
      ]);

      const arData = arRes.data?.data || arRes.data;
      const enData = enRes.data?.data || enRes.data;

      const extractId = (field: any) => {
        if (!field) return "";
        return typeof field === "object" ? field._id : field;
      };

      const mapBilingualArray = (enArr: any[] = [], arArr: any[] = []) => {
        return enArr.map((item, index) => ({
          text: {
            en: item?.text || "",
            ar: arArr[index]?.text || "",
          },
        }));
      };

      return {
        ...enData,
        title: { en: enData.title || "", ar: arData.title || "" },
        description: { en: enData.description || "", ar: arData.description || "" },
        locationDetails: { en: enData.locationDetails || "", ar: arData.locationDetails || "" },
        duration: { en: enData.duration || "", ar: arData.duration || "" },
        
        fieldOfWork: extractId(enData.fieldOfWork),
        experienceLevel: extractId(enData.experienceLevel),
        country: extractId(enData.country),
        
        expirationDate: enData.expirationDate ? new Date(enData.expirationDate).toISOString().slice(0, 16) : "",
        
        jobType: enData.jobType || "full-time",
        employmentType: enData.employmentType || "permanent",
        workMode: enData.workMode || "office",
        organization: enData.organization || "",
        company: enData.company || "",
        jobId: enData.jobId || "",

        keywords: enData.keywords?.map((k: any) => extractId(k)) || [],
        responsibilities: mapBilingualArray(enData.responsibilities, arData.responsibilities),
        requirements: mapBilingualArray(enData.requirements, arData.requirements),
      };
    },
    enabled: !!id,
    refetchOnMount: true, 
  });
};

export const useJob = (id: string, lang: string) => {
  return useQuery({
    queryKey: ["job", id, lang],
    queryFn: async () => {
      const res = await jobsClient.get<SingleJobResponse>(`/job/${id}?lang=${lang}`, {
        headers: { "Accept-Language": lang },
      });
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("jobs.messages");
  return useMutation({
    mutationFn: async (data: CreateJobInput) => {
      const res = await jobsClient.post("/job", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(t("createSuccess"));
    },
    onError: () => toast.error(t("error")),
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("jobs.messages");
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateJobInput> }) => {
      const res = await jobsClient.patch(`/job/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      queryClient.invalidateQueries({ queryKey: ["job", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["job_bilingual", variables.id] });
      toast.success(t("updateSuccess"));
    },
    onError: () => toast.error(t("error")),
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("jobs.messages");
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await jobsClient.delete(`/job/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(t("deleteSuccess"));
    },
    onError: () => toast.error(t("error")),
  });
};

export const useToggleJobStatus = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("jobs.messages");
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await jobsClient.patch(`/job/toggle-activation/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success(t("toggleSuccess"));
    },
    onError: () => toast.error(t("error")),
  });
};