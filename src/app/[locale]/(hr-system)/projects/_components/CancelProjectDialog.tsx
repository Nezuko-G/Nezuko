"use client";

import { useProjects } from "../_hooks/useProjects";
import { Project } from "../types/project.types";

interface Props {
    project: Project;
    onClose: () => void;
}

export function CancelProjectDialog({ project, onClose }: Props) {
    const { cancelProject, loading } = useProjects();

    async function handleConfirm() {
        const success = await cancelProject(project.id);
        if (success) onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">

                <h2 className="text-base font-medium text-gray-900 mb-2">
                    Cancel project?
                </h2>

                <p className="text-sm text-gray-500 mb-3">
                    You&apos;re about to cancel{" "}
                    <span className="font-medium text-gray-800">{project.name}</span>.
                </p>

                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5">
                    All tasks that are not DONE will be set to BLOCKED.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                    >
                        Go back
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Cancelling..." : "Yes, cancel"}
                    </button>
                </div>
            </div>
        </div>
    );
}