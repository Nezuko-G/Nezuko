// "use client";

// import { useEffect, useState } from "react";
// import { useTranslations } from "next-intl";
// import { Upload, Trash2, FileText } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useEmployeeStore } from "../../stores/employee.store";
// import type { EmployeeDocument } from "../../types/employees.dto";

// interface Props {
//     employeeId: string;
//     readOnly?: boolean;
// }

// export default function DocumentsTab({ employeeId, readOnly }: Props) {
//     const t = useTranslations("employees.documents");
//     const { documents, isDocLoading, fetchDocuments, deleteDocument, uploadDocument } = useEmployeeStore();
//     const [showUpload, setShowUpload] = useState(false);
//     const [deleteTarget, setDeleteTarget] = useState<EmployeeDocument | null>(null);
//     const [uploadForm, setUploadForm] = useState({ fileName: "", type: "", expiryDate: "" });
//     const [isUploading, setIsUploading] = useState(false);

//     useEffect(() => { fetchDocuments(employeeId); }, [employeeId]);

//     const handleUpload = async () => {
//         if (!uploadForm.fileName || !uploadForm.type) return;
//         setIsUploading(true);
//         await uploadDocument(employeeId, {
//             ...uploadForm,
//             uploadedAt: new Date().toISOString().split("T")[0],
//             url: "#",
//             expiryStatus: "OK",
//         });
//         setIsUploading(false);
//         setShowUpload(false);
//         setUploadForm({ fileName: "", type: "", expiryDate: "" });
//     };

//     const handleDelete = async () => {
//         if (!deleteTarget) return;
//         await deleteDocument(employeeId, deleteTarget.id);
//         setDeleteTarget(null);
//     };

//     return (
//         <div className="flex flex-col gap-4">
//             {!readOnly && (
//                 <div className="flex justify-end">
//                     <button
//                         onClick={() => setShowUpload((v) => !v)}
//                         className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition"
//                     >
//                         <Upload size={14} /> {t("upload")}
//                     </button>
//                 </div>
//             )}

//             {showUpload && (
//                 <div className="bg-background rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
//                     <input
//                         placeholder={t("uploadForm.fileName")}
//                         value={uploadForm.fileName}
//                         onChange={(e) => setUploadForm((f) => ({ ...f, fileName: e.target.value }))}
//                         className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
//                     />
//                     <input
//                         placeholder={t("uploadForm.type")}
//                         value={uploadForm.type}
//                         onChange={(e) => setUploadForm((f) => ({ ...f, type: e.target.value }))}
//                         className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
//                     />
//                     <input
//                         type="date"
//                         placeholder={t("uploadForm.expiryDate")}
//                         value={uploadForm.expiryDate}
//                         onChange={(e) => setUploadForm((f) => ({ ...f, expiryDate: e.target.value }))}
//                         className="px-3 py-2 rounded-xl border border-gray-200 bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
//                     />
//                     <button
//                         onClick={handleUpload}
//                         disabled={isUploading}
//                         className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-60"
//                     >
//                         {isUploading ? t("uploading") : t("save")}
//                     </button>
//                 </div>
//             )}

//             {isDocLoading ? (
//                 <p className="text-content-muted text-sm text-center py-8">{t("loading")}</p>
//             ) : documents.length === 0 ? (
//                 <p className="text-content-muted text-sm text-center py-8">{t("noDocuments")}</p>
//             ) : (
//                 <div className="flex flex-col gap-2">
//                     {documents.map((doc) => (
//                         <div key={doc.id} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-background hover:bg-gray-50/60 transition">
//                             <div className="flex items-center gap-3">
//                                 <FileText size={16} className="text-primary shrink-0" />
//                                 <div>
//                                     <p className="text-sm font-semibold text-secondary">{doc.fileName}</p>
//                                     <p className="text-xs text-content-muted">{doc.type} · {doc.uploadedAt}</p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-2">
//                                 {doc.expiryStatus === "EXPIRED" && (
//                                     <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-status-error/10 text-status-error">{t("expired")}</span>
//                                 )}
//                                 {doc.expiryStatus === "EXPIRING_SOON" && (
//                                     <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-600">{t("expiringSoon")}</span>
//                                 )}
//                                 {!readOnly && (
//                                     <button
//                                         onClick={() => setDeleteTarget(doc)}
//                                         className="p-1.5 rounded-lg hover:bg-status-error/10 text-content-muted hover:text-status-error transition"
//                                     >
//                                         <Trash2 size={14} />
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {deleteTarget && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
//                     <div className="bg-card w-full max-w-sm rounded-2xl shadow-2xl border border-gray-100 p-6 text-center flex flex-col gap-4">
//                         <p className="font-bold text-secondary">{t("deleteConfirm", { name: deleteTarget.fileName })}</p>
//                         <div className="flex gap-3">
//                             <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-content-muted hover:bg-gray-100 transition">
//                                 {t("cancel")}
//                             </button>
//                             <button onClick={handleDelete} className="flex-1 py-2 rounded-xl bg-status-error text-white text-sm font-bold hover:opacity-90 transition">
//                                 {t("delete")}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }