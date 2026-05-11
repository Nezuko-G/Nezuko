"use client";

interface ProjectProgressData {
    totalCount: number;
    completedCount: number;
    completionPercentage: number;
    overdueCount: number;
    estimatedHours: number;
    actualHours: number;
    hoursVariance: number;
}

interface Props {
    data: ProjectProgressData;
}

export function ProjectProgress({ data }: Props) {
    const {
        totalCount, completedCount, completionPercentage,
        overdueCount, estimatedHours, actualHours, hoursVariance,
    } = data;

    const hoursPercent = estimatedHours > 0
        ? Math.min(100, Math.round((actualHours / estimatedHours) * 100))
        : 0;

    const varianceColor = hoursVariance >= 0 ? "text-status-success" : "text-status-error";

    return (
        <div className="space-y-3">

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard label="Completion"  value={`${Math.round(completionPercentage)}%`} />
                <StatCard label="Total tasks" value={totalCount} />
                <StatCard label="Completed"   value={completedCount} valueClass="text-status-success" />
                <StatCard label="Overdue"     value={overdueCount}   valueClass={overdueCount > 0 ? "text-status-error" : undefined} />
            </div>

            {/* ── Tasks progress bar ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Tasks progress</span>
                    <span className="text-sm font-semibold text-secondary">{completedCount} / {totalCount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-status-success rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(completionPercentage)}%` }}
                    />
                </div>
            </div>

            {/* ── Hours breakdown ── */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-sm text-gray-500 mb-3">Hours breakdown</p>
                <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Estimated</p>
                        <p className="text-lg font-semibold text-secondary">{estimatedHours}h</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Actual</p>
                        <p className="text-lg font-semibold text-secondary">{actualHours}h</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-0.5">Variance</p>
                        <p className={`text-lg font-semibold ${varianceColor}`}>
                            {hoursVariance > 0 ? "+" : ""}{hoursVariance}h
                        </p>
                    </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${hoursPercent}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">0h</span>
                    <span className="text-xs text-gray-400">{estimatedHours}h estimated</span>
                </div>
            </div>

        </div>
    );
}

function StatCard({ label, value, valueClass }: {
    label: string; value: string | number; valueClass?: string;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-2xl font-semibold text-secondary ${valueClass ?? ""}`}>{value}</p>
        </div>
    );
}