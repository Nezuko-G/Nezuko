import type { Timesheet } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";

export interface EmployeeOption {
  id: string;
  firstName: string;
  lastName: string;
}

export function deriveEmployees(timesheets: Timesheet[]): EmployeeOption[] {
  const map = new Map<string, EmployeeOption>();
  for (const ts of timesheets) {
    if (ts.user) {
      const { id, firstName, lastName } = ts.user;
      if (!map.has(id)) {
        map.set(id, { id, firstName, lastName });
      }
    }
  }
  return Array.from(map.values());
}
