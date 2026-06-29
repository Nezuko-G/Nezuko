"use client";

import { Fragment } from "react";

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
      <div className="flex items-center justify-between gap-3 mt-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16 ms-auto" />
      </div>
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
    <tr className="border-b border-gray-50 last:border-0">
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-48" />
      </td>
      <td className="px-4 py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-4 py-3 text-center">
        <Skeleton className="h-5 w-16 rounded-full mx-auto" />
      </td>
      <td className="px-4 py-3 text-center">
        <Skeleton className="h-4 w-20 mx-auto" />
      </td>
      <td className="px-4 py-3 text-center">
        <Skeleton className="h-5 w-20 rounded-full mx-auto" />
      </td>
    </tr>
  );
}


export function TaskListLoader({ count = 5 }: { count?: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
            <th className="px-4 py-4 text-start w-8" />
            <th className="px-4 py-4 text-start">Title</th>
            <th className="px-4 py-4 text-start whitespace-nowrap">Project</th>
            <th className="px-4 py-4 text-start whitespace-nowrap">Created By</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">Priority</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">Schedule</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array.from({ length: count }).map((_, i) => (
            <tr key={i} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <Skeleton className="h-3.5 w-3.5" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-48" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-16 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-14" />
                </div>
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-20 rounded-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export function OverdueReportLoader({ groups = 3 }: { groups?: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-card shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-content-muted text-xs font-bold uppercase tracking-wider">
            <th className="px-4 py-4 text-start">Title</th>
            <th className="px-4 py-4 text-start whitespace-nowrap">Project</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">Priority</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">Due Date</th>
            <th className="px-4 py-4 text-center whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: groups }).map((_, i) => (
            <Fragment key={i}>
              <tr className="bg-primary/4 border-b border-gray-100">
                <td colSpan={5} className="px-4 py-2.5 border-s-[3px] border-primary/15">
                  <Skeleton className="h-4 w-36" />
                </td>
              </tr>
              {Array.from({ length: 2 }).map((_, j) => (
                <TaskRowSkeleton key={`${i}-${j}`} />
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}