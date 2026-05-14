import type {
    DashboardResponse,
    KeyMetrics,
    Charts,
    Insights,
    RawData,
} from "@/app/[locale]/(hr-system)/dashboard/types/dashboard.dto";
import {
    DashboardResponseDTO,
} from "@/app/[locale]/(hr-system)/dashboard/types/dashboard.dto";
import type { z } from "zod";


type DashboardResponseDTOType = z.infer<typeof DashboardResponseDTO>;
type KeyMetricsDTOType = DashboardResponseDTOType["data"]["keyMetrics"];
type ChartsDTOType = DashboardResponseDTOType["data"]["charts"];
type InsightsDTOType = DashboardResponseDTOType["data"]["insights"];
type RawDataDTOType = DashboardResponseDTOType["data"]["rawData"];


function mapKeyMetricsFromDTO(dto: KeyMetricsDTOType): KeyMetrics {
    return {
        totalEmployees: dto.totalEmployees,
        totalDepartments: dto.totalDepartments,
        totalProjects: dto.totalProjects,
        totalTasks: dto.totalTasks,
        pendingLeaves: dto.pendingLeaves,
        activeAssets: dto.activeAssets,
        averageSalary: dto.averageSalary,
    };
}

function mapChartsFromDTO(dto: ChartsDTOType): Charts {
    return { ...dto };
}

function mapInsightsFromDTO(dto: InsightsDTOType): Insights {
    return {
        ...dto,
        recentHires: {
            ...dto.recentHires,
            data: dto.recentHires.data.map((hire) => ({
                ...hire,
                hireDate: hire.hireDate ? new Date(hire.hireDate) : null,
            })),
        },
    };
}

function mapRawDataFromDTO(dto: RawDataDTOType): RawData {
    return { ...dto };
}


export function mapDashboardFromDTO(dto: DashboardResponseDTOType): DashboardResponse {
    return {
        status: dto.status,
        data: {
            keyMetrics: mapKeyMetricsFromDTO(dto.data.keyMetrics),
            charts: mapChartsFromDTO(dto.data.charts),
            insights: mapInsightsFromDTO(dto.data.insights),
            rawData: mapRawDataFromDTO(dto.data.rawData),
        },
    };
}