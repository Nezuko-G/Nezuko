// "use client";

// import { useEffect, useState } from "react";
// import { useTranslations } from "next-intl";
// import { useParams, useRouter } from "next/navigation";
// import { ArrowLeft, UserCircle2, AlertTriangle } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useEmployeeStore } from "../stores/employee.store";
// import ProfileSections from "./components/ProfileSections";
// import TerminateDialog from "../components/TerminateDialog";

// export default function EmployeeProfilePage() {
//     const t = useTranslations("employees.profile");
//     const { id } = useParams<{ id: string }>();
//     const router = useRouter();
//     const { selectedEmployee, isLoading, fetchEmployee } = useEmployeeStore();
//     const [showTerminate, setShowTerminate] = useState(false);

//     useEffect(() => { fetchEmployee(id); }, [id]);

//     if (isLoading) return <div className="p-8 text-center text-content-muted">{t("loading")}</div>;
//     if (!selectedEmployee) return <div className="p-8 text-center text-content-muted">{t("notFound")}</div>;

//     const emp = selectedEmployee;
//     const initials = `${emp.firstName[0]}${emp.lastName[0]}`;
//     const isTerminated = emp.status === "TERMINATED";

//     return (
//         <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-6">
//             <button
//                 onClick={() => router.push("/employees")}
//                 className="flex items-center gap-2 text-content-muted hover:text-secondary text-sm font-semibold transition w-fit"
//             >
//                 <ArrowLeft size={16} /> {t("back")}
//             </button>

//             <div className="flex flex-col lg:flex-row gap-6">
//                 <div className="w-full lg:w-64 shrink-0 bg-card rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4 self-start">
//                     <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-extrabold text-2xl">
//                         {emp.avatarUrl ? (
//                             <img src={emp.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
//                         ) : initials}
//                     </div>
//                     <div className="text-center">
//                         <p className="font-extrabold text-secondary text-lg">{emp.firstName} {emp.lastName}</p>
//                         <p className="text-content-muted text-sm">{emp.jobTitle}</p>
//                         <p className="text-xs text-content-muted mt-1">{emp.email}</p>
//                     </div>
//                     <span className={cn(
//                         "px-3 py-1 rounded-full text-xs font-bold",
//                         isTerminated ? "bg-status-error/10 text-status-error" : "bg-status-success/10 text-status-success"
//                     )}>
//                         {t(`status.${emp.status.toLowerCase()}`)}
//                     </span>
//                     <div className="w-full border-t border-gray-100 pt-4 flex flex-col gap-2 text-xs text-content-muted">
//                         <p><span className="font-semibold text-secondary">{t("fields.code")}: </span><span className="font-mono">{emp.employeeCode}</span></p>
//                         <p><span className="font-semibold text-secondary">{t("fields.department")}: </span>{emp.department.name}</p>
//                         <p><span className="font-semibold text-secondary">{t("fields.hireDate")}: </span>{emp.hireDate}</p>
//                     </div>

//                     {!isTerminated && (
//                         <button
//                             onClick={() => setShowTerminate(true)}
//                             className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-status-error/30 text-status-error text-sm font-semibold hover:bg-status-error/5 transition mt-2"
//                         >
//                             <AlertTriangle size={14} /> {t("terminate")}
//                         </button>
//                     )}
//                 </div>

//                 <div className="flex-1 min-w-0">
//                     <ProfileSections employee={emp} readOnly={isTerminated} />
//                 </div>
//             </div>

//             <TerminateDialog employee={showTerminate ? emp : null} onClose={() => setShowTerminate(false)} />
//         </div>
//     );
// }