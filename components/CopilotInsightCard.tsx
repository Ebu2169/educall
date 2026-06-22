import type { ClassSummary } from "@/lib/types";
import { ShieldIcon, SparkleIcon } from "./icons";

export function CopilotInsightCard({ summary }: { summary: ClassSummary }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-[var(--shadow-soft)]">
      {/* Header band */}
      <div className="flex items-center gap-2 border-b border-brand-100 bg-brand-50 px-5 py-3">
        <span className="grid size-8 place-items-center rounded-lg bg-brand-600 text-white">
          <SparkleIcon width={18} height={18} />
        </span>
        <div>
          <p className="text-sm font-bold text-brand-800">AI хураангуй</p>
          <p className="text-[11px] text-brand-700">
            AI Classroom Copilot · энэ долоо хоног
          </p>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-[var(--color-ink)]">
          {summary.headline}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
          {summary.body}
        </p>

        <p className="mt-4 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
          <ShieldIcon
            width={14}
            height={14}
            className="mt-0.5 shrink-0 text-amber-600"
          />
          <span>
            Энэ бол эрт сэрэмжлүүлэх дохио — эцсийн дүгнэлт биш. Багшийн
            ажиглалтаар баталгаажуулна уу.
          </span>
        </p>
      </div>
    </div>
  );
}
