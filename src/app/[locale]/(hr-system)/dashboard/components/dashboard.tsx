"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
    Users,
    Building2,
    FolderKanban,
    CheckSquare,
    CalendarClock,
    TrendingUp,
    AlertCircle,
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../hooks/useDashboard";

// ─── Color palette (matches navbar teal/emerald accent) ───────────────────────
const PIE_COLORS = ["#0d9488", "#14b8a6", "#99f6e4", "#ccfbf1"];

const BAR_COLORS: Record<string, string> = {
    TODO:        "#0d9488",
    IN_PROGRESS: "#0891b2",
    DONE:        "#059669",
    CANCELLED:   "#e11d48",
};

const BADGE_STYLES = {
    info:    "bg-teal-50 text-teal-700 border border-teal-200",
    warn:    "bg-amber-50 text-amber-700 border border-amber-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const ICON_BG    = "bg-teal-50";
const ICON_COLOR = "text-teal-600";

// ─── Animation ────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.35, delay },
});

// ─── MetricCard ───────────────────────────────────────────────────────────────
function MetricCard({
    icon: Icon,
    value,
    label,
    badge,
    badgeVariant = "info",
    delay = 0,
}: {
    icon: React.ElementType;
    value: number | string;
    label: string;
    badge?: string;
    badgeVariant?: "info" | "warn" | "success";
    delay?: number;
}) {
    return (
        <motion.div
            {...fadeUp(delay)}
            className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${ICON_BG}`}>
                <Icon size={17} className={ICON_COLOR} />
            </div>
            <div>
                <p className="text-2xl font-bold tracking-tight text-gray-900">{value}</p>
                <p className="mt-0.5 text-[11px] font-medium text-gray-400">{label}</p>
            </div>
            {badge && (
                <span className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${BADGE_STYLES[badgeVariant]}`}>
                    {badge}
                </span>
            )}
        </motion.div>
    );
}

// ─── ChartCard ────────────────────────────────────────────────────────────────
function ChartCard({
    title,
    children,
    full = false,
    delay = 0,
}: {
    title: string;
    children: React.ReactNode;
    full?: boolean;
    delay?: number;
}) {
    return (
        <motion.div
            {...fadeUp(delay)}
            className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${full ? "col-span-full" : ""}`}
        >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {title}
            </p>
            {children}
        </motion.div>
    );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function CustomTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { name: string; value: number }[];
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 shadow-lg">
            <p className="font-semibold text-gray-500">{payload[0].name}</p>
            <p className="font-bold text-gray-900">{payload[0].value}</p>
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function DashboardSkeleton() {
    return (
        <div className="mx-auto max-w-6xl animate-pulse px-6 pb-16 pt-10">
            <div className="mb-10 flex flex-col items-center gap-3 border-b border-gray-200 pb-8">
                <div className="h-5 w-28 rounded-full bg-gray-200" />
                <div className="h-9 w-56 rounded-lg bg-gray-200" />
                <div className="h-4 w-44 rounded-lg bg-gray-100" />
            </div>
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-36 rounded-2xl bg-gray-100" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="h-72 rounded-2xl bg-gray-100" />
                <div className="h-72 rounded-2xl bg-gray-100" />
                <div className="col-span-full h-72 rounded-2xl bg-gray-100" />
            </div>
        </div>
    );
}

// ─── Error ────────────────────────────────────────────────────────────────────
function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle size={22} className="text-red-500" />
            </div>
            <p className="text-sm text-gray-500">{message}</p>
            <button
                onClick={onRetry}
                className="rounded-full bg-teal-50 px-5 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
            >
                Try Again
            </button>
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const t = useTranslations("dashboard");
    const { data, isLoading, isError, error, refetch } = useDashboard();

    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-50">
                <DashboardSkeleton />
            </main>
        );
    }

    if (isError || !data) {
        return (
            <main className="min-h-screen bg-gray-50">
                <DashboardError
                    message={(error as Error)?.message ?? "Failed to load dashboard"}
                    onRetry={() => refetch()}
                />
            </main>
        );
    }

    const { keyMetrics, charts, insights } = data.data;

    const metricCards = [
        {
            icon: Users,
            value: keyMetrics.totalEmployees,
            label: t("metrics.totalEmployees"),
            badge: t("metrics.activeBadge"),
            badgeVariant: "success" as const,
        },
        {
            icon: Building2,
            value: keyMetrics.totalDepartments,
            label: t("metrics.totalDepartments"),
        },
        {
            icon: FolderKanban,
            value: keyMetrics.totalProjects,
            label: t("metrics.totalProjects"),
            badge: `${insights.projectsOverview.overdueTasksCount} ${t("metrics.overdueBadge")}`,
            badgeVariant: "warn" as const,
        },
        {
            icon: CheckSquare,
            value: keyMetrics.totalTasks,
            label: t("metrics.totalTasks"),
        },
        {
            icon: CalendarClock,
            value: keyMetrics.pendingLeaves,
            label: t("metrics.pendingLeaves"),
            badge: t("metrics.pendingBadge"),
            badgeVariant: "warn" as const,
        },
        {
            icon: TrendingUp,
            value: `${insights.attendanceOverview.presentPercentage}%`,
            label: t("metrics.attendanceRate"),
            badge: t("metrics.attendanceBadge"),
            badgeVariant: "success" as const,
        },
    ];

    const taskBarData = charts.taskStatus.data.map((item) => ({
        name: t(`taskStatus.${item.label}`) ?? item.label,
        value: item.value,
        fill: BAR_COLORS[item.label] ?? "#0d9488",
    }));

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-6 pb-16 pt-10">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mb-10 border-b border-gray-200 pb-8 text-center"
                >
                    <span className="mb-3 inline-block rounded-full border border-teal-200 bg-teal-50 px-4 py-1 text-[11px] font-semibold uppercase tracking-widest text-teal-700">
                        {t("header.badge")}
                    </span>
                    <h1 className="mb-2 text-4xl font-bold text-gray-900 md:text-5xl">
                        {t("header.title1")}{" "}
                        <span className="text-teal-600">{t("header.title2")}</span>
                    </h1>
                    <p className="text-sm text-gray-400">{t("header.subtitle")}</p>
                </motion.div>

                {/* ── Key Metrics ── */}
                <div className="mb-3 flex items-center gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                        {t("sections.metrics")}
                    </p>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                    {metricCards.map((card, i) => (
                        <MetricCard key={i} {...card} delay={i * 0.06} />
                    ))}
                </div>

                {/* ── Analytics ── */}
                <div className="mb-3 flex items-center gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                        {t("sections.charts")}
                    </p>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Gender Pie */}
                    <ChartCard title={t("charts.employeesByGender")} delay={0.1}>
                        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
                            {charts.employeesByGender.data.map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                                    {t(`gender.${item.label}`)} —{" "}
                                    <span className="font-semibold text-gray-800">{item.value}</span>
                                </span>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={charts.employeesByGender.data}
                                    dataKey="value"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={82}
                                    paddingAngle={3}
                                >
                                    {charts.employeesByGender.data.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Project Status Pie */}
                    <ChartCard title={t("charts.projectStatus")} delay={0.15}>
                        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
                            {charts.projectStatus.data.map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                                    {t(`projectStatus.${item.label}`)} —{" "}
                                    <span className="font-semibold text-gray-800">{item.value}</span>
                                </span>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={charts.projectStatus.data}
                                    dataKey="value"
                                    nameKey="label"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={82}
                                    paddingAngle={3}
                                >
                                    {charts.projectStatus.data.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* Task Status Bar */}
                    <ChartCard title={t("charts.taskStatus")} full delay={0.2}>
                        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
                            {taskBarData.map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-[12px] text-gray-500">
                                    <span className="h-2 w-2 rounded-full" style={{ background: item.fill }} />
                                    {item.name} —{" "}
                                    <span className="font-semibold text-gray-800">{item.value}</span>
                                </span>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={taskBarData} barSize={44}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#d1d5db", fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(13,148,136,0.05)" }} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {taskBarData.map((entry, i) => (
                                        <Cell key={i} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </div>
        </main>
    );
}