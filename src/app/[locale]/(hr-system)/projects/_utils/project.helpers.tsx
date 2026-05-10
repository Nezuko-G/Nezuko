export function formatDate(iso?: string): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

export function getDaysLeft(dueDate?: string): number | null {
    if (!dueDate) return null;
    return Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

export function getTimelineProgress(startDate?: string, dueDate?: string): number {
    if (!startDate || !dueDate) return 0;
    const start = new Date(startDate).getTime();
    const end = new Date(dueDate).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
}