// "use client";

// import { useState } from "react";
// import { useTranslations } from "next-intl";
// import { Save } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useEmployeeStore } from "../../stores/employee.store";
// import DocumentsTab from "./DocumentsTab";
// import type { Employee } from "../../types/employees.dto";

// type Section = "personal" | "job" | "address" | "emergency" | "documents";

// const SECTIONS: Section[] = ["personal", "job", "address", "emergency", "documents"];

// interface Props {
//     employee: Employee;
//     readOnly?: boolean;
// }

// export default function ProfileSections({ employee, readOnly }: Props) {
//     const t = useTranslations("employees.profile");
//     const { updateEmployee } = useEmployeeStore();
//     const [activeSection, setActiveSection] = useState<Section>("personal");
//     const [form, setForm] = useState({ ...employee });
//     const [isSaving, setIsSaving] = useState(false);

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const set = (key: string, value: string) => setForm((f: any) => ({ ...f, [key]: value }));
//     const setNested = (parent: string, key: string, value: string) =>
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         setForm((f: any) => ({ ...f, [parent]: { ...(f[parent] ?? {}), [key]: value } }));

//     const handleSave = async () => {
//         setIsSaving(true);
//         await updateEmployee(employee.id, form);
//         setIsSaving(false);
//     };

//     return (
//         <div className="flex flex-col gap-2">
//             <div className="flex gap-1 flex-wrap border-b border-gray-100 pb-1">
//                 {SECTIONS.map((s) => (
//                     <button
//                         key={s}
//                         onClick={() => setActiveSection(s)}
//                         className={cn(
//                             "px-4 py-2 rounded-t-lg text-sm font-semibold transition",
//                             activeSection === s
//                                 ? "bg-primary text-secondry"
//                                 : "text-content-muted hover:text-secondary hover:bg-gray-100"
//                         )}
//                     >
//                         {t(`sections.${s}`)}
//                     </button>
//                 ))}
//             </div>

//             <div className="bg-card rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
//                 {activeSection === "personal" && (
//                     <SectionGrid>
//                         <Field label={t("fields.firstName")} value={form.firstName} onChange={(v) => set("firstName", v)} readOnly={readOnly} />
//                         <Field label={t("fields.lastName")} value={form.lastName} onChange={(v) => set("lastName", v)} readOnly={readOnly} />
//                         <Field label={t("fields.email")} value={form.email} onChange={(v) => set("email", v)} type="email" readOnly={readOnly} />
//                         <Field label={t("fields.phone")} value={form.phone ?? ""} onChange={(v) => set("phone", v)} readOnly={readOnly} />
//                         <Field label={t("fields.gender")} value={form.gender} onChange={(v) => set("gender", v)} readOnly={readOnly} />
//                     </SectionGrid>
//                 )}

//                 {activeSection === "job" && (
//                     <SectionGrid>
//                         <Field label={t("fields.jobTitle")} value={form.jobTitle} onChange={(v) => set("jobTitle", v)} readOnly={readOnly} />
//                         <Field label={t("fields.department")} value={form.department.name} onChange={() => { }} readOnly />
//                         <Field label={t("fields.employeeCode")} value={form.employeeCode} onChange={() => { }} readOnly />
//                         <Field label={t("fields.hireDate")} value={form.hireDate} onChange={(v) => set("hireDate", v)} type="date" readOnly={readOnly} />
//                         <Field label={t("fields.status")} value={form.status} onChange={() => { }} readOnly />
//                     </SectionGrid>
//                 )}

//                 {activeSection === "address" && (
//                     <SectionGrid>
//                         <Field label={t("fields.street")} value={form.address?.street ?? ""} onChange={(v) => setNested("address", "street", v)} readOnly={readOnly} />
//                         <Field label={t("fields.city")} value={form.address?.city ?? ""} onChange={(v) => setNested("address", "city", v)} readOnly={readOnly} />
//                         <Field label={t("fields.state")} value={form.address?.state ?? ""} onChange={(v) => setNested("address", "state", v)} readOnly={readOnly} />
//                         <Field label={t("fields.country")} value={form.address?.country ?? ""} onChange={(v) => setNested("address", "country", v)} readOnly={readOnly} />
//                         <Field label={t("fields.postalCode")} value={form.address?.postalCode ?? ""} onChange={(v) => setNested("address", "postalCode", v)} readOnly={readOnly} />
//                     </SectionGrid>
//                 )}

//                 {activeSection === "emergency" && (
//                     <SectionGrid>
//                         <Field label={t("fields.contactName")} value={form.emergencyContact?.name ?? ""} onChange={(v) => setNested("emergencyContact", "name", v)} readOnly={readOnly} />
//                         <Field label={t("fields.relationship")} value={form.emergencyContact?.relationship ?? ""} onChange={(v) => setNested("emergencyContact", "relationship", v)} readOnly={readOnly} />
//                         <Field label={t("fields.contactPhone")} value={form.emergencyContact?.phone ?? ""} onChange={(v) => setNested("emergencyContact", "phone", v)} readOnly={readOnly} />
//                     </SectionGrid>
//                 )}

//                 {activeSection === "documents" && (
//                     <DocumentsTab employeeId={employee.id} readOnly={readOnly} />
//                 )}

//                 {activeSection !== "documents" && !readOnly && (
//                     <div className="flex justify-end pt-2">
//                         <button
//                             onClick={handleSave}
//                             disabled={isSaving}
//                             className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-secondry text-sm font-bold shadow hover:opacity-90 transition disabled:opacity-60"
//                         >
//                             <Save size={14} />
//                             {isSaving ? t("saving") : t("save")}
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// function SectionGrid({ children }: { children: React.ReactNode }) {
//     return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
// }

// function Field({ label, value, onChange, type = "text", readOnly }: {
//     label: string; value: string; onChange: (v: string) => void;
//     type?: string; readOnly?: boolean;
// }) {
//     return (
//         <div className="flex flex-col gap-1">
//             <label className="text-xs font-semibold text-content-muted">{label}</label>
//             <input
//                 type={type}
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 readOnly={readOnly}
//                 className={cn(
//                     "px-3 py-2 rounded-xl border text-content text-sm focus:outline-none",
//                     readOnly
//                         ? "bg-gray-50 border-gray-100 text-content-muted cursor-default"
//                         : "bg-background border-gray-200 focus:ring-2 focus:ring-primary/30"
//                 )}
//             />
//         </div>
//     );
// }