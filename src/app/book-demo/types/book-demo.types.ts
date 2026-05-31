
export const EMPLOYEE_RANGE_MAP: Record<string, string> = {
    "1-25": "FROM_1_TO_25",
    "26-100": "FROM_26_TO_100",
    "101-250": "FROM_101_TO_250",
    "250+": "MORE_THAN_250",
};


export const INTEREST_MAP: Record<string, string> = {
    coreHR: "CORE_HR",
    talent: "TALENT",
    spend: "SPEND",
};

export type InterestKey = keyof typeof INTEREST_MAP;

export interface BookDemoPayload {
    fullName: string;
    email: string;
    companyName: string;
    jobTitle: string;
    phone: string;
    employeeCount?: string;
    interests: string[];
}