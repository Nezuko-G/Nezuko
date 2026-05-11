"use client";

import { useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import AddEmployeeModal from "./components/AddEmployeeModal";
import TerminateDialog from "./components/TerminateDialog";
import type { Employee } from "./types";

export default function EmployeesPage() {
    const [showAdd, setShowAdd] = useState(false);
    const [terminateTarget, setTerminateTarget] = useState<Employee | null>(null);
    

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <EmployeeTable
                onAddClick={() => setShowAdd(true)}
                onTerminate={(e) => setTerminateTarget(e)}
            />
            <AddEmployeeModal open={showAdd} onClose={() => setShowAdd(false)} />
            <TerminateDialog employee={terminateTarget} onClose={() => setTerminateTarget(null)} />
        </div>
    );
}