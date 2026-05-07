import DashboardHero from "./components/DashboardHero";
import LeaveBalances from "./components/LeaveBalances";

export default function DashboardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <DashboardHero />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-8">
          <LeaveBalances />
        </div>

        <div className="lg:col-span-4 flex flex-col justify-end">
          <div className="bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl h-[140px] flex items-center justify-center text-gray-500 font-medium">
            المهام والطلبات (Quick Actions) هتنزل هنا
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl h-[300px] flex items-center justify-center text-gray-500 font-medium">
          حالة الموظفين (Status) هتنزل هنا
        </div>

        <div className="lg:col-span-8 bg-gray-200 border-2 border-dashed border-gray-300 rounded-2xl h-[300px] flex items-center justify-center text-gray-500 font-medium">
          سجل الحضور (Attendance) هينزل هنا
        </div>
      </div>
    </div>
  );
}
