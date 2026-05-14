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

const PIE_COLORS = ["#1D9E75", "#5DCAA5", "#9FE1CB", "#E1F5EE"];

const BAR_COLORS: Record<string, string> = {
    TODO: "#1D9E75",
    IN_PROGRESS: "#185FA5",
    DONE: "#3B6D11",
    CANCELLED: "#A32D2D",
};

const BADGE_STYLES = {
    info: "bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB]",
    warn: "bg-[#FAEEDA] text-[#633806] border border-[#FAC775]",
    success: "bg-[#E1F5EE] text-[#085041] border border-[#9FE1CB]",
};

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.35, delay },
});

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
            className="flex flex-col gap-3 rounded-2xl border border-[#e4e4e0] bg-white p-4 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E1F5EE]">
                <Icon size={18} className="text-[#0F6E56]" />
            </div>
            <div>
                <p className="text-[26px] font-medium leading-none tracking-tight text-[#0f1d2e]">
                    {value}
                </p>
                <p className="mt-1 text-[12px] text-[#888780]">{label}</p>
            </div>
            {badge && (
                <span className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-medium ${BADGE_STYLES[badgeVariant]}`}>
                    {badge}
                </span>
            )}
        </motion.div>
    );
}

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
            className={`rounded-2xl border border-[#e4e4e0] bg-white p-5 ${full ? "col-span-full" : ""}`}
        >
            <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-[#888780]">
                {title}
            </p>
            {children}
        </motion.div>
    );
}

function CustomTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: { name: string; value: number }[];
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-[#e4e4e0] bg-white px-3 py-2 text-xs shadow-lg">
            <p className="font-medium text-[#888780]">{payload[0].name}</p>
            <p className="font-semibold text-[#0f1d2e]">{payload[0].value}</p>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="mx-auto max-w-6xl animate-pulse px-6 pb-16 pt-10">
            <div className="mb-10 flex flex-col items-center gap-3 border-b border-[#e4e4e0] pb-8">
                <div className="h-5 w-24 rounded-full bg-[#E1F5EE]" />
                <div className="h-10 w-56 rounded-lg bg-gray-100" />
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

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle size={22} className="text-red-500" />
            </div>
            <p className="text-sm text-[#888780]">{message}</p>
            <button
                onClick={onRetry}
                className="rounded-full bg-[#E1F5EE] px-5 py-2 text-sm font-medium text-[#085041] transition hover:bg-[#9FE1CB]"
            >
                Try Again
            </button>
        </div>
    );
}

export default function DashboardPage() {
    const t = useTranslations("dashboard");
    const { data, isLoading, isError, error, refetch } = useDashboard();

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#f5f6f8]">
                <DashboardSkeleton />
            </main>
        );
    }

    if (isError || !data) {
        return (
            <main className="min-h-screen bg-[#f5f6f8]">
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
        fill: BAR_COLORS[item.label] ?? "#1D9E75",
    }));

    return (
        <main className="min-h-screen bg-[#f5f6f8]">
            <div className="mx-auto max-w-6xl px-6 pb-16 pt-10">

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="mb-10 border-b border-[#e4e4e0] pb-8 text-center"
                >
                    <span className="mb-3 inline-block rounded-full border border-[#9FE1CB] bg-[#E1F5EE] px-4 py-1 text-[11px] font-medium uppercase tracking-widest text-[#0F6E56]">
                        {t("header.badge")}
                    </span>
                    <h1 className="mb-2 text-4xl font-medium text-[#0f1d2e] md:text-5xl">
                        {t("header.title1")}{" "}
                        <span className="text-[#1d9e75]">{t("header.title2")}</span>
                    </h1>
                    <p className="text-sm text-[#888780]">{t("header.subtitle")}</p>
                </motion.div>

                {/* ── Key Metrics ── */}
                <div className="mb-3 flex items-center gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-[#888780]">
                        {t("sections.metrics")}
                    </p>
                    <div className="h-px flex-1 bg-[#D3D1C7]" />
                </div>

                <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                    {metricCards.map((card, i) => (
                        <MetricCard key={i} {...card} delay={i * 0.06} />
                    ))}
                </div>

                {/* ── Analytics ── */}
                <div className="mb-3 flex items-center gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-[#888780]">
                        {t("sections.charts")}
                    </p>
                    <div className="h-px flex-1 bg-[#D3D1C7]" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* Gender Pie */}
                    <ChartCard title={t("charts.employeesByGender")} delay={0.1}>
                        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
                            {charts.employeesByGender.data.map((item, i) => (
                                <span key={i} className="flex items-center gap-2 text-[13px] text-[#5F5E5A]">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: PIE_COLORS[i] }}
                                    />
                                    {t(`gender.${item.label}`)} —{" "}
                                    <span className="font-medium text-[#0f1d2e]">{item.value}</span>
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
                                    innerRadius={58}
                                    outerRadius={85}
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
                        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
                            {charts.projectStatus.data.map((item, i) => (
                                <span key={i} className="flex items-center gap-2 text-[13px] text-[#5F5E5A]">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: PIE_COLORS[i] }}
                                    />
                                    {t(`projectStatus.${item.label}`)} —{" "}
                                    <span className="font-medium text-[#0f1d2e]">{item.value}</span>
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
                                    innerRadius={58}
                                    outerRadius={85}
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
                        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2">
                            {taskBarData.map((item, i) => (
                                <span key={i} className="flex items-center gap-2 text-[13px] text-[#5F5E5A]">
                                    <span className="h-2 w-2 rounded-full" style={{ background: item.fill }} />
                                    {item.name} —{" "}
                                    <span className="font-medium text-[#0f1d2e]">{item.value}</span>
                                </span>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={taskBarData} barSize={48}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#888780", fontSize: 13 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: "#B4B2A9", fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: "rgba(29,158,117,0.06)" }}
                                />
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