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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = response as any;
    if (res.error || !res.data) {
        throw new Error(res.error || "Failed to load dashboard");
    }

    const parsed = DashboardResponseDTO.safeParse(response.data);

    if (!parsed.success) {
        console.error("Zod Parsing Error:", parsed.error.format());
        throw new Error("Invalid dashboard data structure received from API");
    }

    return mapDashboardFromDTO(parsed.data);
}