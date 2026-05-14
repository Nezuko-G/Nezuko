import { DashboardResponseDTO } from "@/app/[locale]/(hr-system)/dashboard/types/dashboard.dto";
import { mapDashboardFromDTO } from "@/app/[locale]/(hr-system)/dashboard/mappers/dashboard.mapper";
import { apis } from "@/lib/api/config";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
    const url = `${API_BASE}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...options.headers,
            },
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage =
                typeof data?.message === "string"
                    ? data.message
                    : `Request failed with status ${response.status}`;
            return { data: null, error: errorMessage, status: response.status };
        }

        return { data, error: null, status: response.status };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (err.name === "AbortError" || err.code === "ERR_CANCELED") {
            return { data: null, error: "Request canceled", status: 0 };
        }
        if (err.name === "TypeError" && err.message.includes("network")) {
            return { data: null, error: "Connection timeout. Please try again.", status: 0 };
        }
        return { data: null, error: err.message || "An error occurred", status: 0 };
    }
}

export async function getDashboard() {
    const response = await apiRequest<unknown>(apis.dashboard.base);

    if (response.error) throw new Error(response.error);
    if (!response.data) throw new Error("No data received");

    const parsed = DashboardResponseDTO.safeParse(response.data);
    if (!parsed.success) throw new Error("Invalid dashboard data received");

    return mapDashboardFromDTO(parsed.data);
}