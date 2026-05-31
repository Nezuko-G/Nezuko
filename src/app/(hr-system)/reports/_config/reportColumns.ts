export const reportColumnsConfig: Record<string, string[]> = {
  "headcount": ["departmentName", "employeeCount"],
  "leave-summary": ["employeeName", "employeeCode", "departmentName", "approvedLeaves", "rejectedLeaves", "pendingLeaves"],
  "overtime": ["employeeName", "employeeCode", "departmentName", "overtimeHours", "entries"],
  "asset-custody": ["employeeName", "assetName", "serialNumber", "category", "status"],
  "task-completion": ["projectName", "assigneeName", "completedTasks", "pendingTasks", "completionRate"]
};