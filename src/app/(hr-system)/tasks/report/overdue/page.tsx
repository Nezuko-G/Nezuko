"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { OverdueReportPage } from "../../../projects/_components/TasksPages";

export default function OverdueReportRoute() {
    const { id: currentUserId } = useAuthStore();

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <OverdueReportPage currentUserId={currentUserId ?? ""} />
        </div>
    );
}
