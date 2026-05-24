import type { AxiosFormattedResponse } from "@/lib/axios/types/axios.types";

export function throwIfError(response: AxiosFormattedResponse): void {
  if (response.error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error: any = new Error(String(response.error));
    error.status = response.status;
    throw error;
  }
}

export function extractList(
  response: AxiosFormattedResponse,
  key?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = response.data?.data ?? response.data ?? [];
  if (Array.isArray(data)) return data;
  if (key && typeof data === "object" && key in data) return data[key];
  return data.timesheets ?? data.items ?? [];
}

export function combineDateAndTime(date: string | Date, time: string): string {
  const dateStr = typeof date === "string" ? date : date.toISOString().split("T")[0];
  return `${dateStr}T${time}:00Z`;
}
