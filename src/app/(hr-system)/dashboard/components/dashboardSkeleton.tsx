
export default function 
DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="h-16 w-full animate-pulse rounded-3xl bg-gray-200" />
      </div>
      <div className="mx-auto max-w-6xl animate-pulse px-4 pb-12 pt-6">
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl border-2 border-gray-200 bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-72 rounded-2xl border-2 border-gray-200 bg-gray-100" />
          <div className="h-72 rounded-2xl border-2 border-gray-200 bg-gray-100" />
          <div className="col-span-full h-72 rounded-2xl border-2 border-gray-200 bg-gray-100" />
        </div>
      </div>
    </div>
  );
}