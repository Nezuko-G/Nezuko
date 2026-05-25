"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CreateJobInput } from "../types/job.dto";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

interface JobFormProps {
  initialData?: Partial<CreateJobInput>;
  onSubmit: (data: CreateJobInput) => void;
  isPending: boolean;
}

const defaultData: CreateJobInput = {
  title: { en: "", ar: "" },
  description: { en: "", ar: "" },
  locationDetails: { en: "", ar: "" },
  duration: { en: "", ar: "" },
  jobId: "",
  company: "",
  organization: "",
  fieldOfWork: "",
  experienceLevel: "",
  keywords: [],
  jobType: "full-time",
  employmentType: "permanent",
  responsibilities: [],
  requirements: [],
  country: "",
  workMode: "remote",
  expirationDate: "",
};

export default function JobForm({
  initialData,
  onSubmit,
  isPending,
}: JobFormProps) {
  const t = useTranslations("jobs.form");
  const router = useRouter();
  const [formData, setFormData] = useState<CreateJobInput>({
    ...defaultData,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (
    field: keyof CreateJobInput,
    value: any,
    lang?: "en" | "ar",
  ) => {
    if (lang) {
      setFormData((prev) => ({
        ...prev,
        [field]: { ...(prev[field] as any), [lang]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayChange = (
    field: "responsibilities" | "requirements",
    index: number,
    lang: "en" | "ar",
    value: string,
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = {
        ...newArray[index],
        text: { ...newArray[index].text, [lang]: value },
      };
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: "responsibilities" | "requirements") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], { text: { en: "", ar: "" } }],
    }));
  };

  const removeArrayItem = (
    field: "responsibilities" | "requirements",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.expirationDate) {
      payload.expirationDate = new Date(payload.expirationDate).toISOString();
    }
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.__v;
    delete payload.slug;
    delete payload.is_active;
    delete payload.is_deleted;
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-10"
    >
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-secondary">
          {t("sections.basic")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.titleAr")}
            </label>
            <input
              required
              value={formData.title.ar}
              onChange={(e) => handleChange("title", e.target.value, "ar")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.titleEn")}
            </label>
            <input
              required
              value={formData.title.en}
              onChange={(e) => handleChange("title", e.target.value, "en")}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm text-left"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.jobId")}
            </label>
            <input
              required
              value={formData.jobId}
              onChange={(e) => handleChange("jobId", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.company")}
            </label>
            <input
              required
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.organization")}
            </label>
            <input
              value={formData.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.expirationDate")}
            </label>
            <input
              required
              type="datetime-local"
              value={formData.expirationDate}
              onChange={(e) => handleChange("expirationDate", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-secondary">
          {t("sections.details")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.descAr")}
            </label>
            <textarea
              required
              rows={3}
              value={formData.description.ar}
              onChange={(e) =>
                handleChange("description", e.target.value, "ar")
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.descEn")}
            </label>
            <textarea
              required
              rows={3}
              value={formData.description.en}
              onChange={(e) =>
                handleChange("description", e.target.value, "en")
              }
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm resize-none text-left"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.locationAr")}
            </label>
            <input
              value={formData.locationDetails.ar}
              onChange={(e) =>
                handleChange("locationDetails", e.target.value, "ar")
              }
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.locationEn")}
            </label>
            <input
              value={formData.locationDetails.en}
              onChange={(e) =>
                handleChange("locationDetails", e.target.value, "en")
              }
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm text-left"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.durationAr")}
            </label>
            <input
              value={formData.duration.ar}
              onChange={(e) => handleChange("duration", e.target.value, "ar")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.durationEn")}
            </label>
            <input
              value={formData.duration.en}
              onChange={(e) => handleChange("duration", e.target.value, "en")}
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm text-left"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-secondary">
          {t("sections.classification")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.jobType")}
            </label>
            <select
              value={formData.jobType}
              onChange={(e) => handleChange("jobType", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            >
              <option value="full-time">{t("options.fullTime")}</option>
              <option value="part-time">{t("options.partTime")}</option>
              <option value="internship">{t("options.internship")}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.employmentType")}
            </label>
            <select
              value={formData.employmentType}
              onChange={(e) => handleChange("employmentType", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            >
              <option value="permanent">{t("options.permanent")}</option>
              <option value="contract">{t("options.contract")}</option>
              <option value="fixed-term">{t("options.fixedTerm")}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.workMode")}
            </label>
            <select
              value={formData.workMode}
              onChange={(e) => handleChange("workMode", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            >
              <option value="office">{t("options.office")}</option>
              <option value="remote">{t("options.remote")}</option>
              <option value="hybrid">{t("options.hybrid")}</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.countryId")}
            </label>
            <input
              required
              placeholder="Country ObjectId"
              value={formData.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.fieldOfWorkId")}
            </label>
            <input
              required
              placeholder="Category ObjectId"
              value={formData.fieldOfWork}
              onChange={(e) => handleChange("fieldOfWork", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-content-dark">
              {t("fields.experienceLevelId")}
            </label>
            <input
              required
              placeholder="Level ObjectId"
              value={formData.experienceLevel}
              onChange={(e) => handleChange("experienceLevel", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-secondary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-secondary">
            {t("sections.responsibilities")}
          </h3>
          <button
            type="button"
            onClick={() => addArrayItem("responsibilities")}
            className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <Plus size={14} /> {t("buttons.add")}
          </button>
        </div>
        <div className="space-y-3">
          {formData.responsibilities.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder={t("placeholders.ar")}
                  value={item.text.ar}
                  onChange={(e) =>
                    handleArrayChange(
                      "responsibilities",
                      index,
                      "ar",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none font-medium text-sm"
                />
                <input
                  placeholder={t("placeholders.en")}
                  value={item.text.en}
                  onChange={(e) =>
                    handleArrayChange(
                      "responsibilities",
                      index,
                      "en",
                      e.target.value,
                    )
                  }
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none font-medium text-sm text-left"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem("responsibilities", index)}
                className="p-2 text-status-error hover:bg-status-error/10 rounded-lg transition-colors mt-0.5"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-secondary">
            {t("sections.requirements")}
          </h3>
          <button
            type="button"
            onClick={() => addArrayItem("requirements")}
            className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1"
          >
            <Plus size={14} /> {t("buttons.add")}
          </button>
        </div>
        <div className="space-y-3">
          {formData.requirements.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder={t("placeholders.ar")}
                  value={item.text.ar}
                  onChange={(e) =>
                    handleArrayChange(
                      "requirements",
                      index,
                      "ar",
                      e.target.value,
                    )
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none font-medium text-sm"
                />
                <input
                  placeholder={t("placeholders.en")}
                  value={item.text.en}
                  onChange={(e) =>
                    handleArrayChange(
                      "requirements",
                      index,
                      "en",
                      e.target.value,
                    )
                  }
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white outline-none font-medium text-sm text-left"
                />
              </div>
              <button
                type="button"
                onClick={() => removeArrayItem("requirements", index)}
                className="p-2 text-status-error hover:bg-status-error/10 rounded-lg transition-colors mt-0.5"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-gray-50 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl border border-gray-200 text-content-dark font-bold text-sm hover:bg-gray-50 transition-all"
        >
          {t("buttons.cancel")}
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-secondary font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {t("buttons.save")}
        </button>
      </div>
    </form>
  );
}
