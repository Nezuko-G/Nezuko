"use client";


function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-100 ${className}`}
      aria-hidden="true"
    />
  );
}


export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center gap-3 mt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
      </div>
      {/* Progress bar */}
      <Skeleton className="h-2 w-full rounded-full mt-1" />
    </div>
  );
}


export function ProjectListLoader({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}


export function ProjectDetailLoader() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>

      {/* Progress stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex flex-col gap-2"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-16" />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Task list */}
      <TaskListLoader />
    </div>
  );
}


export function TaskRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 last:border-0">
      <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
      <div className="flex flex-col gap-1.5 flex-1">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
  );
}


export function TaskListLoader({ count = 5 }: { count?: number }) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <TaskRowSkeleton key={i} />
      ))}
    </div>
  );
}


export function OverdueReportLoader({ groups = 3 }: { groups?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: groups }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
        >
          {/* Group header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-20 rounded-full ms-auto" />
          </div>
          {/* Tasks */}
          {Array.from({ length: 2 }).map((_, j) => (
            <TaskRowSkeleton key={j} />
          ))}
        </div>
      ))}
    </div>
  );
}