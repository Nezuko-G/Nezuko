import { AlertCircle, RefreshCw } from "lucide-react";

export function TableSkeleton({
  columns,
  rows = 5,
}: {
  columns: { key: string; label: string }[];
  rows?: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-4 py-3 text-xs font-medium text-gray-500"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-gray-100">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: col.key === "actions" ? "4rem" : "6rem" }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
      <p className="text-red-600 font-medium mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400 text-base">{message}</p>
    </div>
  );
}

export function SpinnerIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  );
}
