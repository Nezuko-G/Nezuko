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
  ArrowUpRight,
  LayoutDashboard,
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
  RadialBarChart,
  RadialBar,
} from "recharts";
import { useDashboard } from "../hooks/useDashboard";

const PIE_COLORS = ["#00FFB9", "#00cc94", "#000028", "#1a1a3d"];

const BAR_COLORS: Record<string, string> = {
  TODO: "#1a1a3d",
  IN_PROGRESS: "#f59e0b",
  DONE: "#00FFB9",
  CANCELLED: "#ef4444",
};

const BADGE_STYLES = {
  info: "bg-primary-light text-secondary border-2 border-primary/40",
  warn: "bg-status-warning/10 text-status-warning border-2 border-status-warning/40",
  success: "bg-status-success/10 text-status-success border-2 border-status-success/40",
};

const METRIC_ACCENT: Record<number, string> = {
  0: "border-l-status-success",
  1: "border-l-secondary",
  2: "border-l-status-warning",
  3: "border-l-primary",
  4: "border-l-status-warning",
  5: "border-l-status-success",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.35, delay },
});

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mb-4 mt-6 flex items-center gap-3">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      <p className="text-[11px] font-semibold uppercase tracking-widest text-content-muted">
        {label}
      </p>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
  badge,
  badgeVariant = "info",
  delay = 0,
  index = 0,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  badge?: string;
  badgeVariant?: "info" | "warn" | "success";
  delay?: number;
  index?: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-2xl border-2 border-gray-200 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-secondary/20 hover:shadow-md border-l-4 ${METRIC_ACCENT[index]}`}
    >
      <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-secondary/[0.03] transition-all duration-300 group-hover:scale-150" />
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-primary/20 bg-primary-light">
          <Icon size={16} className="text-secondary" />
        </div>
        <ArrowUpRight size={14} className="text-content-muted opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div>
        <p className="text-[28px] font-semibold leading-none tracking-tight text-secondary">
          {value}
        </p>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-wide text-content-muted">
          {label}
        </p>
      </div>
      {badge && (
        <span className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${BADGE_STYLES[badgeVariant]}`}>
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
      className={`rounded-2xl border-2 border-gray-200 bg-card p-5 shadow-sm ${full ? "col-span-full" : ""}`}
    >
      <div className="mb-5 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-content-muted">
          {title}
        </p>
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      </div>
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
    <div className="rounded-xl border-2 border-gray-200 bg-card px-3 py-2 text-xs shadow-xl">
      <p className="font-medium text-content-muted">{payload[0].name}</p>
      <p className="text-base font-bold text-secondary">{payload[0].value}</p>
    </div>
  );
}

function AttendanceRing({ percentage }: { percentage: number }) {
  const data = [
    { name: "Present", value: percentage, fill: "#00FFB9" },
    { name: "Absent", value: 100 - percentage, fill: "#e5e7eb" },
  ];
  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={160} height={160}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={52}
          outerRadius={74}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar dataKey="value" cornerRadius={6}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </RadialBar>
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center">
        <span className="text-[20px] font-bold text-secondary">{percentage}%</span>
        <span className="text-[9px] font-semibold uppercase tracking-widest text-content-muted">
          Present
        </span>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 w-full animate-pulse bg-gray-200" />
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

function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
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

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-background">
        <DashboardError
          message={(error as Error)?.message ?? "Failed to load dashboard"}
          onRetry={() => refetch()}
        />
      </main>
    );
  }

  const { keyMetrics, charts, insights } = data.data;
  const attendancePct = insights.attendanceOverview.presentPercentage;

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
      value: `${attendancePct}%`,
      label: t("metrics.attendanceRate"),
      badge: t("metrics.attendanceBadge"),
      badgeVariant: "success" as const,
    },
  ];

  const taskBarData = charts.taskStatus.data.map((item) => ({
    name: t(`taskStatus.${item.label}`) ?? item.label,
    value: item.value,
    fill: BAR_COLORS[item.label] ?? "#00FFB9",
  }));

  return (
    <main className="min-h-screen bg-background">

      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full bg-secondary px-4 py-4"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-primary/30 bg-primary/10">
              <LayoutDashboard size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-[17px] font-semibold leading-none text-white">
                {t("header.title1")}{" "}
                <span className="text-primary">{t("header.title2")}</span>
              </h1>
              <p className="mt-0.5 text-[11px] text-white/40">{t("header.subtitle")}</p>
            </div>
          </div>
          <span className="rounded-full border-2 border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
            {t("header.badge")}
          </span>
        </div>
      </motion.header>

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-4">

        <SectionDivider label={t("sections.metrics")} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {metricCards.map((card, i) => (
            <MetricCard key={i} {...card} delay={i * 0.06} index={i} />
          ))}
        </div>

        <SectionDivider label={t("sections.charts")} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          <ChartCard title={t("charts.employeesByGender")} delay={0.1}>
            <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
              {charts.employeesByGender.data.map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-[13px] text-content">
                  <span
                    className="h-2.5 w-2.5 rounded-sm border border-black/10"
                    style={{ background: PIE_COLORS[i] }}
                  />
                  {t(`gender.${item.label}`)}{" "}
                  <span className="font-semibold text-secondary">{item.value}</span>
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
                  paddingAngle={4}
                  strokeWidth={2}
                  stroke="#f9fafb"
                >
                  {charts.employeesByGender.data.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <motion.div
            {...fadeUp(0.15)}
            className="rounded-2xl border-2 border-gray-200 bg-card p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-content-muted">
                  {t("metrics.attendanceRate")}
                </p>
                <p className="mt-0.5 text-[13px] font-semibold text-secondary">
                  {t("metrics.attendanceBadge")}
                </p>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <div className="flex items-center justify-around">
              <AttendanceRing percentage={attendancePct} />
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border-2 border-primary/20 bg-primary-light px-5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-secondary/60">
                    Present
                  </p>
                  <p className="text-[26px] font-bold leading-none text-secondary">
                    {attendancePct}%
                  </p>
                </div>
                <div className="rounded-xl border-2 border-gray-200 bg-background px-5 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-content-muted">
                    Absent
                  </p>
                  <p className="text-[26px] font-bold leading-none text-secondary">
                    {100 - attendancePct}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <ChartCard title={t("charts.projectStatus")} delay={0.2}>
            <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2">
              {charts.projectStatus.data.map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-[13px] text-content">
                  <span
                    className="h-2.5 w-2.5 rounded-sm border border-black/10"
                    style={{ background: PIE_COLORS[i] }}
                  />
                  {t(`projectStatus.${item.label}`)}{" "}
                  <span className="font-semibold text-secondary">{item.value}</span>
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
                  paddingAngle={4}
                  strokeWidth={2}
                  stroke="#f9fafb"
                >
                  {charts.projectStatus.data.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <motion.div
            {...fadeUp(0.25)}
            className="flex flex-col justify-between rounded-2xl border-2 border-status-warning/30 bg-status-warning/5 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-status-warning">
                  Overdue Tasks
                </span>
                <p className="mt-1 text-[44px] font-bold leading-none text-secondary">
                  {insights.projectsOverview.overdueTasksCount}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-status-warning/30 bg-status-warning/10">
                <AlertCircle size={18} className="text-status-warning" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-content-muted">Total Tasks</span>
                <span className="font-semibold text-secondary">{keyMetrics.totalTasks}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-status-warning transition-all"
                  style={{
                    width: `${Math.min(
                      (insights.projectsOverview.overdueTasksCount / keyMetrics.totalTasks) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-content-muted">
                {(
                  (insights.projectsOverview.overdueTasksCount / keyMetrics.totalTasks) * 100
                ).toFixed(1)}% of total tasks overdue
              </p>
            </div>
          </motion.div>

          <ChartCard title={t("charts.taskStatus")} full delay={0.3}>
            <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
              {taskBarData.map((item, i) => (
                <span key={i} className="flex items-center gap-2 text-[13px] text-content">
                  <span
                    className="h-2.5 w-2.5 rounded-sm border border-black/10"
                    style={{ background: item.fill }}
                  />
                  {item.name}{" "}
                  <span className="font-semibold text-secondary">{item.value}</span>
                </span>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={taskBarData} barSize={44}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(0,0,40,0.04)", radius: 8 }}
                />
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