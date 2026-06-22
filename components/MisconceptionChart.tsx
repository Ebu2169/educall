import type { MisconceptionBucket } from "@/lib/types";
import { PulseIcon } from "./icons";

const barColors = [
  "bg-rose-400",
  "bg-amber-400",
  "bg-brand-500",
  "bg-slate-400",
];

export function MisconceptionChart({
  buckets,
  total,
}: {
  buckets: MisconceptionBucket[];
  total: number;
}) {
  const max = Math.max(...buckets.map((b) => b.studentCount), 1);

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-brand-50 text-brand-600">
          <PulseIcon width={18} height={18} />
        </span>
        <div>
          <h2 className="text-base font-bold text-[var(--color-ink)]">
            Энэ долоо хоногийн ангийн ойлголтын алдаанууд
          </h2>
          <p className="text-xs text-[var(--color-ink-soft)]">
            Хамгийн их давтагдсан бэрхшээлүүд
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">
        {buckets.map((b, i) => {
          const pct = Math.round((b.studentCount / max) * 100);
          const ofClass = Math.round((b.studentCount / total) * 100);
          return (
            <div key={b.tag}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-[var(--color-ink)]">
                  {b.label}
                </span>
                <span className="font-semibold text-[var(--color-ink-soft)]">
                  {b.studentCount} сурагч
                  <span className="ml-1 text-xs font-normal text-[var(--color-ink-muted)]">
                    ({ofClass}%)
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`bar-grow h-full rounded-full ${barColors[i % barColors.length]}`}
                  style={{
                    width: `${pct}%`,
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
