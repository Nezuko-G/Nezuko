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
    Legend,
} from "recharts";

interface KeyMetrics {
    totalEmployees: number;
    totalDepartments: number;
    totalProjects: number;
    totalTasks: number;
    pendingLeaves: number;
    activeAssets: number;
}

interface DashboardData {
    keyMetrics: KeyMetrics;
    charts: {
        employeesByGender: { data: { label: string; value: number }[] };
        projectStatus: { data: { label: string; value: number }[] };
        taskStatus: { data: { label: string; value: number }[] };
    };
    insights: {
        attendanceOverview: { presentPercentage: number; absentPercentage: number };
        projectsOverview: { overdueTasksCount: number };
    };
}

const PIE_COLORS = ["#4f6ef7", "#818cf8", "#a5b4fc", "#c7d2fe"];
const BAR_COLORS = { TODO: "#4f6ef7", IN_PROGRESS: "#10b981" };

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.45, delay },
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
    const badgeClass =
        badgeVariant === "warn"
            ? "bg-amber-500/10 text-amber-400"
            : badgeVariant === "success"
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-[#4f6ef7]/10 text-[#818cf8]";

    return (
        <motion.div
            {...fadeUp(delay)}
            className="relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.05] p-5 hover:-translate-y-1 hover:border-[#4f6ef7]/30 transition-all duration-200"
        >
            {/* glow blob */}
            <div className="pointer-events-none absolute -left-6 -top-6 h-20 w-20 rounded-full bg-[#4f6ef7] opacity-[0.06]" />

            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#4f6ef7]/10">
                <Icon size={18} className="text-[#818cf8]" />
            </div>

            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-[2rem] font-black leading-none text-white">
                {value}
            </p>
            <p className="mt-1.5 text-xs font-semibold text-white/40">{label}</p>

            {badge && (
                <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badgeClass}`}>
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
            className={`rounded-[20px] border border-white/[0.08] bg-white/[0.05] p-5 ${full ? "col-span-full" : ""}`}
        >
            <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#4f6ef7]" />
                <h3 className="text-[13px] font-bold tracking-wide text-white/60">{title}</h3>
            </div>
            {children}
        </motion.div>
    );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-white/10 bg-[#00003d] px-3 py-2 text-xs text-white shadow-xl">
            <p className="font-bold text-[#818cf8]">{payload[0].name}</p>
            <p className="text-white/80">{payload[0].value}</p>
        </div>
    );
}

export default function DashboardPage({ data }: { data: DashboardData }) {
    const t = useTranslations("dashboard");

    const { keyMetrics, charts, insights } = data;

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
            badgeVariant: "info" as const,
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
            badgeVariant: "info" as const,
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

    // task status bar chart data
    const taskBarData = charts.taskStatus.data.map((item) => ({
        name: t(`taskStatus.${item.label}`) ?? item.label,
        value: item.value,
        fill: BAR_COLORS[item.label as keyof typeof BAR_COLORS] ?? "#4f6ef7",
    }));

    return (
        <main
            dir="rtl"
            className="min-h-screen bg-[#000028] font-['Cairo',sans-serif]"
            style={{ fontFamily: "'Cairo', sans-serif" }}
        >
            <div className="mx-auto max-w-5xl px-5 pb-16 pt-10">

                {/* page header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="mb-10 border-b border-white/[0.08] pb-8 text-center"
                >
                    <span className="mb-4 inline-block rounded-full bg-[#4f6ef7]/15 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#818cf8]">
                        {t("header.badge")}
                    </span>
                    <h1 className="mb-2 text-4xl font-black leading-tight text-white md:text-5xl">
                        {t("header.title1")}{" "}
                        <span className="text-[#4f6ef7]">{t("header.title2")}</span>
                    </h1>
                    <p className="text-base text-white/40">{t("header.subtitle")}</p>
                </motion.div>

                {/*  key metrics*/}
                <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-white/30">
                        {t("sections.metrics")}
                    </h2>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                    {metricCards.map((card, i) => (
                        <MetricCard key={i} {...card} delay={i * 0.07} />
                    ))}
                </div>

                {/* charts  */}
                <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-sm font-black uppercase tracking-widest text-white/30">
                        {t("sections.charts")}
                    </h2>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* chart 1 — employees by gender (pie) */}
                    <ChartCard title={t("charts.employeesByGender")} delay={0.1}>
                        <div className="mb-3 flex flex-wrap gap-3">
                            {charts.employeesByGender.data.map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-[12px] text-white/60">
                                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                                    {t(`gender.${item.label}`) ?? item.label} — {item.value}
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
                                    innerRadius={52}
                                    outerRadius={80}
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

                    {/* chart 2 — project status (pie) */}
                    <ChartCard title={t("charts.projectStatus")} delay={0.17}>
                        <div className="mb-3 flex flex-wrap gap-3">
                            {charts.projectStatus.data.map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-[12px] text-white/60">
                                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                                    {t(`projectStatus.${item.label}`) ?? item.label} — {item.value}
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
                                    innerRadius={52}
                                    outerRadius={80}
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

                    {/* chart 3 — task status (bar) — full width */}
                    <ChartCard title={t("charts.taskStatus")} full delay={0.24}>
                        <div className="mb-3 flex flex-wrap gap-3">
                            {taskBarData.map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-[12px] text-white/60">
                                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: item.fill }} />
                                    {item.name} — {item.value}
                                </span>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={taskBarData} barSize={40}>
                                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Cairo" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79,110,247,0.07)" }} />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
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