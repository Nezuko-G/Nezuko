import type { Employee, Department, EmployeeDocument } from "../types/employees.dto";

export const MOCK_DEPARTMENTS: Department[] = [
    { id: "d1", name: "Engineering" },
    { id: "d2", name: "Human Resources" },
    { id: "d3", name: "Finance" },
    { id: "d4", name: "Marketing" },
    { id: "d5", name: "Operations" },
];

export const MOCK_EMPLOYEES: Employee[] = [
    {
        id: "e1",
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@company.com",
        employeeCode: "EMP-001",
        jobTitle: "Senior Engineer",
        department: MOCK_DEPARTMENTS[0],
        hireDate: "2022-03-15",
        status: "ACTIVE",
        gender: "FEMALE",
        phone: "+1 555 000 1111",
        address: { street: "123 Main St", city: "New York", state: "NY", country: "US", postalCode: "10001" },
        emergencyContact: { name: "Tom Johnson", relationship: "Spouse", phone: "+1 555 000 9999" },
    },
    {
        id: "e2",
        firstName: "Marcus",
        lastName: "Chen",
        email: "marcus.chen@company.com",
        employeeCode: "EMP-002",
        jobTitle: "HR Manager",
        department: MOCK_DEPARTMENTS[1],
        hireDate: "2021-07-01",
        status: "ACTIVE",
        gender: "MALE",
        phone: "+1 555 000 2222",
        address: { street: "456 Oak Ave", city: "San Francisco", state: "CA", country: "US", postalCode: "94102" },
        emergencyContact: { name: "Lisa Chen", relationship: "Sister", phone: "+1 555 000 8888" },
    },
    {
        id: "e3",
        firstName: "Aisha",
        lastName: "Patel",
        email: "aisha.patel@company.com",
        employeeCode: "EMP-003",
        jobTitle: "Financial Analyst",
        department: MOCK_DEPARTMENTS[2],
        hireDate: "2020-01-10",
        status: "TERMINATED",
        gender: "FEMALE",
        phone: "+1 555 000 3333",
    },
    {
        id: "e4",
        firstName: "James",
        lastName: "Rivera",
        email: "james.rivera@company.com",
        employeeCode: "EMP-004",
        jobTitle: "Marketing Lead",
        department: MOCK_DEPARTMENTS[3],
        hireDate: "2023-05-20",
        status: "ACTIVE",
        gender: "MALE",
        phone: "+1 555 000 4444",
        address: { street: "789 Pine Rd", city: "Austin", state: "TX", country: "US", postalCode: "73301" },
        emergencyContact: { name: "Maria Rivera", relationship: "Mother", phone: "+1 555 000 7777" },
    },
    {
        id: "e5",
        firstName: "Lena",
        lastName: "Müller",
        email: "lena.muller@company.com",
        employeeCode: "EMP-005",
        jobTitle: "Operations Specialist",
        department: MOCK_DEPARTMENTS[4],
        hireDate: "2022-11-30",
        status: "ACTIVE",
        gender: "FEMALE",
        phone: "+1 555 000 5555",
    },
];

export const MOCK_DOCUMENTS: Record<string, EmployeeDocument[]> = {
    e1: [
        { id: "doc1", fileName: "contract_2022.pdf", type: "CONTRACT", uploadedAt: "2022-03-15", url: "#", expiryStatus: "OK" },
        { id: "doc2", fileName: "id_card.pdf", type: "ID", uploadedAt: "2022-03-15", expiryDate: "2026-05-20", url: "#", expiryStatus: "EXPIRING_SOON" },
    ],
    e2: [
        { id: "doc3", fileName: "offer_letter.pdf", type: "OFFER_LETTER", uploadedAt: "2021-07-01", url: "#", expiryStatus: "OK" },
        { id: "doc4", fileName: "health_insurance.pdf", type: "INSURANCE", uploadedAt: "2023-01-01", expiryDate: "2024-12-31", url: "#", expiryStatus: "EXPIRED" },
    ],
    e3: [],
    e4: [
        { id: "doc5", fileName: "nda_2023.pdf", type: "NDA", uploadedAt: "2023-05-20", url: "#", expiryStatus: "OK" },
    ],
    e5: [],
};

export function delay(ms = 400) {
    return new Promise((r) => setTimeout(r, ms));
}