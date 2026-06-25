"use client";

import { useAuthStore } from "@/hooks/useAuthStore";
import { MyTasksPage } from "../../projects/_components/TasksPages";

export default function TasksMePage() {
    const { id: currentUserId } = useAuthStore();

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <MyTasksPage currentUserId={currentUserId ?? ""} />
        </div>
    );
}
