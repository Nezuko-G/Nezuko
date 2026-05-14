import { z } from "zod";


const LabelValueDTO = z.object({
    label: z.string(),
    value: z.number(),
});

const LabelPresentAbsentDTO = z.object({
    label: z.string(),
    present: z.number(),
    absent: z.number(),
});


export const KeyMetricsDTO = z.object({
    totalEmployees: z.number(),
    totalDepartments: z.number(),
    totalProjects: z.number(),
    totalTasks: z.number(),
    pendingLeaves: z.number(),
    activeAssets: z.number(),
    averageSalary: z.number(),
});


const PieChartDTO = z.object({
    type: z.literal("pie"),
    title: z.string(),
    data: z.array(LabelValueDTO),
});

const HistogramChartDTO = z.object({
    type: z.literal("histogram"),
    title: z.string(),
    data: z.array(LabelValueDTO),
});

const AttendanceHistogramDTO = z.object({
    type: z.literal("histogram"),
    title: z.string(),
    data: z.array(LabelPresentAbsentDTO),
});

const LeaveRequestsTrendItemDTO = z.object({
    status: z.string(),
    count: z.number(),
});

const LineChartDTO = z.object({
    type: z.literal("line"),
    title: z.string(),
    data: z.array(z.unknown()),
});

const LeaveRequestsTrendChartDTO = z.object({
    type: z.literal("line"),
    title: z.string(),
    data: z.array(LeaveRequestsTrendItemDTO),
});

export const ChartsDTO = z.object({
    employeesByDepartment: PieChartDTO,
    employeesByStatus: PieChartDTO,
    employeesByGender: PieChartDTO,
    projectStatus: PieChartDTO,
    assetStatus: PieChartDTO,
    assetCondition: PieChartDTO,
    leaveRequestStatus: PieChartDTO,
    employeesByJobTitle: HistogramChartDTO,
    attendanceByDepartment: AttendanceHistogramDTO,
    salaryByDepartment: HistogramChartDTO,
    leaveRequestsByDepartment: HistogramChartDTO,
    overtimeByDepartment: HistogramChartDTO,
    taskStatus: HistogramChartDTO,
    taskPriority: HistogramChartDTO,
    assetsByCategory: HistogramChartDTO,
    insuranceEnrollmentByPlan: HistogramChartDTO,
    hiringTrend: LineChartDTO,
    leaveRequestsTrend: LeaveRequestsTrendChartDTO,
});


const TopDepartmentItemDTO = z.object({
    department: z.string(),
    headcount: z.number(),
});

const TopJobPositionItemDTO = z.object({
    jobTitle: z.string(),
    count: z.number(),
});

const RecentHireItemDTO = z.object({
    name: z.string(),
    position: z.string().nullable(),
    hireDate: z.string().datetime().nullable(),
});

export const InsightsDTO = z.object({
    topDepartments: z.object({
        title: z.string(),
        data: z.array(TopDepartmentItemDTO),
    }),
    topJobPositions: z.object({
        title: z.string(),
        data: z.array(TopJobPositionItemDTO),
    }),
    recentHires: z.object({
        title: z.string(),
        count: z.number(),
        data: z.array(RecentHireItemDTO),
    }),
    employeeTurnover: z.object({
        title: z.string(),
        turnoverRate: z.number(),
        terminatedLastYear: z.number(),
    }),
    attendanceOverview: z.object({
        title: z.string(),
        presentPercentage: z.number(),
        absentPercentage: z.number(),
        totalRecords: z.number(),
    }),
    insuranceOverview: z.object({
        title: z.string(),
        enrollmentRate: z.number(),
        enrolledEmployees: z.number(),
        totalEmployees: z.number(),
    }),
    projectsOverview: z.object({
        title: z.string(),
        totalProjects: z.number(),
        totalTasks: z.number(),
        overdueTasksCount: z.number(),
    }),
    payrollOverview: z.object({
        title: z.string(),
        totalMonthlyPayroll: z.number(),
        averageSalary: z.number(),
        payrollRunsThisYear: z.number(),
    }),
});


const AttendanceByDepartmentRawDTO = z.object({
    department: z.string(),
    presentPercentage: z.number(),
    totalRecords: z.number(),
    presentCount: z.number(),
});

const OvertimeByDepartmentRawDTO = z.object({
    department: z.string(),
    totalOvertimeHours: z.number(),
    averageOvertimeHours: z.number(),
    recordsWithOvertime: z.number(),
});

const LeaveByDepartmentRawDTO = z.object({
    department: z.string(),
    leaveRequestCount: z.number(),
});

export const RawDataDTO = z.object({
    salaryByDepartment: z.array(z.unknown()),
    attendanceByDepartment: z.array(AttendanceByDepartmentRawDTO),
    overtimeByDepartment: z.array(OvertimeByDepartmentRawDTO),
    leaveByDepartment: z.array(LeaveByDepartmentRawDTO),
    insuranceStats: z.array(z.unknown()),
});


export const DashboardResponseDTO = z.object({
    status: z.literal("success"),
    data: z.object({
        keyMetrics: KeyMetricsDTO,
        charts: ChartsDTO,
        insights: InsightsDTO,
        rawData: RawDataDTO,
    }),
});


export type RecentHireItem = {
    name: string;
    position: string | null;
    hireDate: Date | null; 
};

export type Insights = Omit<z.infer<typeof InsightsDTO>, "recentHires"> & {
    recentHires: {
        title: string;
        count: number;
        data: RecentHireItem[];
    };
};

export type KeyMetrics = z.infer<typeof KeyMetricsDTO>;
export type Charts = z.infer<typeof ChartsDTO>;
export type RawData = z.infer<typeof RawDataDTO>;
export type DashboardResponseDTOType = z.infer<typeof DashboardResponseDTO>;

export type DashboardResponse = {
    status: "success";
    data: {
        keyMetrics: KeyMetrics;
        charts: Charts;
        insights: Insights;
        rawData: RawData;
    };
};