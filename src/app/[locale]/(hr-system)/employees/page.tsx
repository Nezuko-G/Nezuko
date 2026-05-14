"use client";

import { useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import type { EmployeeSummary } from "./types/employees.dto";
import AddEmployeeModal from "./components/AddEmployeeModal";
// import TerminateDialog from "./components/TerminateDialog";

export default function EmployeesPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [employeeToTerminate, setEmployeeToTerminate] = useState<EmployeeSummary | null>(null);

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <EmployeeTable
                onAddClick={() => setShowAddModal(true)}
                onTerminate={(emp) => setEmployeeToTerminate(emp)}
            />
            <AddEmployeeModal open={showAddModal} onClose={() => setShowAddModal(false)} />
            {/* <TerminateDialog employee={employeeToTerminate} onClose={() => setEmployeeToTerminate(null)} /> */}
        </div>
    );
}