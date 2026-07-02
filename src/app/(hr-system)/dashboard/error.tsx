"use client";

import DashboardError from "./components/dashboardError";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <DashboardError
      message={error.message || "Failed to load dashboard"}
      onRetry={reset}
    />
  );
}
