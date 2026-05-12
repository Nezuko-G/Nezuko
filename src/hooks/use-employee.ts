import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/lib/api/endpoints/employee";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });
}