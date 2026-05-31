"use client";

interface Props {
  hours: number;
}

export function OvertimeChip({ hours }: Props) {
  if (hours <= 0) return <span className="text-gray-400">—</span>;

  return (
    <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-xs">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {hours.toFixed(2)}
    </span>
  );
}
