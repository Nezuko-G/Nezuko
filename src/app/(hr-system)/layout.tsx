import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex h-screen bg-background overflow-hidden font-sans">
        <Sidebar />
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto ">
            {children}
          </main>
        </div>
      </div>
  );
}