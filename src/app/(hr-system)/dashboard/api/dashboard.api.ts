import {
    DashboardResponseDTO,
    type DashboardResponseDTOType
} from "@/app/(hr-system)/dashboard/types/dashboard.dto";
import { mapDashboardFromDTO } from "@/app/(hr-system)/dashboard/mappers/dashboard.mapper";
import { apis } from "@/lib/api/config";
import { DashboardResponse } from "../types/dashboard.dto";
import api from "@/lib/axios/core/instance";

export async function getDashboard(): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponseDTOType>(apis.dashboard.base);

    const parsed = DashboardResponseDTO.safeParse(response.data);

    if (!parsed.success) {
        console.error("Zod Parsing Error:", parsed.error.format());
        throw new Error("Invalid dashboard data structure received from API");
    }

    return mapDashboardFromDTO(parsed.data);
}