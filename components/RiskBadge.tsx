import type { RiskLevel } from "@/lib/types";
import { RISK_LABEL } from "@/lib/copilot";

const styles: Record<RiskLevel, { wrap: string; dot: string }> = {
  high: {
    wrap: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dot: "bg-rose-500",
  },
  medium: {
    wrap: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dot: "bg-amber-500",
  },
  low: {
    wrap: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
};

export function RiskBadge({
  level,
  className = "",
}: {
  level: RiskLevel;
  className?: string;
}) {
  const s = styles[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.wrap} ${className}`}
    >
      <span
        className={`size-1.5 rounded-full ${s.dot} ${level === "high" ? "animate-pulse-ring" : ""}`}
      />
      {RISK_LABEL[level]}
    </span>
  );
}
