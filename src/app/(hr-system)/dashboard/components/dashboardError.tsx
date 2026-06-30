"use client";

import { AlertCircle } from "lucide-react";

export default function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-status-error/30 bg-status-error/10">
        <AlertCircle size={24} className="text-status-error" />
      </div>

      <p className="text-sm text-content-muted">{message}</p>

      <button
        onClick={onRetry}
        className="rounded-full border-2 border-secondary/20 bg-secondary px-6 py-2 text-sm font-semibold text-primary transition hover:bg-secondary-hover"
      >
        Try Again
      </button>
    </div>
  );
}
