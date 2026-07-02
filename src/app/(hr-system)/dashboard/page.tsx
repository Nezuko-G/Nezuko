import DashboardClient from "./components/dashboard";
import { getDashboard } from "./api/dashboard.api";

export default async function Page() {
  const data = await getDashboard();

  return <DashboardClient initialData={data} />;
}
