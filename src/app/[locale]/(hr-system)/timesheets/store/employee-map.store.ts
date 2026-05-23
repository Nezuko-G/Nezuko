import { create } from "zustand";
import type { Timesheet } from "@/app/[locale]/(hr-system)/timesheets/types/timesheet.dto";

interface EmployeeMapEntry {
  id: string;
  firstName: string;
  lastName: string;
}

interface EmployeeMapState {
  employees: EmployeeMapEntry[];
  setFromTimesheets: (timesheets: Timesheet[]) => void;
  getEmployees: () => EmployeeMapEntry[];
}

export const useEmployeeMapStore = create<EmployeeMapState>((set, get) => ({
  employees: [],

  setFromTimesheets: (timesheets: Timesheet[]) => {
    const map = new Map<string, EmployeeMapEntry>();
    for (const ts of timesheets) {
      if (ts.user) {
        const { id, firstName, lastName } = ts.user;
        if (!map.has(id)) {
          map.set(id, { id, firstName, lastName });
        }
      }
    }
    set({ employees: Array.from(map.values()) });
  },

  getEmployees: () => get().employees,
}));
