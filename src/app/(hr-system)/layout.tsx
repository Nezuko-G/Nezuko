import Navbar from "./_components/Navbar"; 
import Sidebar from "./_components/Sidebar"; 
import { cookies } from "next/headers"; 
import { AuthHydrator } from "@/components/providers/AuthHydrator";
import { getMe } from "@/app/(hr-system)/profile/api/profile.api";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  let shouldRedirect = false;

  try {
    const cookieStore = await cookies();
    const cookieString = cookieStore.toString();

    user = await getMe({ Cookie: cookieString });

    if (!user) {
      shouldRedirect = true;
    }
  } catch (error: unknown) {
    const err = error as { status?: number };
    if (err?.status === 401) {
      shouldRedirect = true;
    }
  }

  if (shouldRedirect) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AuthHydrator user={user} />
      
      <Sidebar />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}