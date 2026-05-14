"use client";

import EmployeeTable from "./components/EmployeeTable";
import AddEmployeeModal from "./components/AddEmployeeModal";
import TerminateDialog from "./components/TerminateDialog";

export default function EmployeesPage() {

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <EmployeeTable />
            <AddEmployeeModal />
            <TerminateDialog />
        </div>
    );
}