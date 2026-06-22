"use client";

import type { StudentRisk } from "@/lib/types";
import { useAppState } from "@/lib/store";
import { isWellbeingTag } from "@/lib/copilot";
import { RiskBadge } from "./RiskBadge";
import {
  BrainIcon,
  CheckCircleIcon,
  CheckIcon,
  LightbulbIcon,
  ShieldIcon,
  TargetIcon,
} from "./icons";

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase();
}

const accentByLevel = {
  high: "border-l-rose-400",
  medium: "border-l-amber-400",
  low: "border-l-emerald-400",
} as const;

const avatarByLevel = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
} as const;

export function StudentRiskCard({
  student,
  rank,
  onViewReasoning,
}: {
  student: StudentRisk;
  rank: number;
  onViewReasoning: (student: StudentRisk) => void;
}) {
  const { checked, feedback, markChecked } = useAppState();
  const isChecked = !!checked[student.studentId];
  const fb = feedback[student.studentId];
  const wellbeing = isWellbeingTag(student.conceptTag);

  return (
    <div
      className={`relative rounded-2xl border border-[var(--color-line)] border-l-4 bg-white p-5 shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-brand-200 hover:shadow-[var(--shadow-lift)] ${accentByLevel[student.riskLevel]} ${
        isChecked ? "opacity-70" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className="relative">
          <span
            className={`grid size-11 place-items-center rounded-xl text-base font-bold text-white shadow-sm ${avatarByLevel[student.riskLevel]}`}
          >
            {initials(student.studentName)}
          </span>
          <span className="absolute -left-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[var(--color-ink)] text-[10px] font-bold text-white">
            {rank}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-[var(--color-ink)]">
              {student.studentName}
            </h3>
            <RiskBadge level={student.riskLevel} />
            {isChecked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                <CheckIcon width={12} height={12} /> Шалгасан
              </span>
            )}
          </div>

          {/* Risk score bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`bar-grow h-full rounded-full ${
                  student.riskLevel === "high"
                    ? "bg-rose-500"
                    : student.riskLevel === "medium"
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${student.riskScore}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-[var(--color-ink-soft)]">
              Эрсдэлийн оноо {student.riskScore}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 grid gap-3 text-sm">
        <Detail
          icon={
            wellbeing ? (
              <ShieldIcon width={15} height={15} />
            ) : (
              <TargetIcon width={15} height={15} />
            )
          }
          label={wellbeing ? "Анхаарах дохио" : "Магадлалт ойлголтын дутагдал"}
          value={student.conceptGap}
          tone={wellbeing ? "text-violet-600" : "text-brand-600"}
        />
        <Detail
          icon={<BrainIcon width={15} height={15} />}
          label="Шалтгаан"
          value={student.reason}
          tone="text-slate-500"
        />
        <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-3">
          <div className="flex items-center gap-1.5 text-brand-700">
            <LightbulbIcon width={15} height={15} />
            <span className="text-xs font-bold uppercase tracking-wide">
              5 минутын зөвлөмж
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink)]">
            {student.suggestedAction}
          </p>
        </div>
      </div>

      {/* Feedback chip */}
      {fb && (
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <CheckCircleIcon width={14} height={14} />
          {fb === "correct"
            ? "Багш: Зөв оношилсон"
            : fb === "not_accurate"
              ? "Багш: Тийм биш"
              : "Багш: Аль хэдийн тусалсан"}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onViewReasoning(student)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98]"
        >
          <BrainIcon width={16} height={16} />
          AI үндэслэл харах
        </button>
        <button
          onClick={() => markChecked(student.studentId, !isChecked)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all active:scale-[0.98] ${
            isChecked
              ? "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              : "border border-slate-200 bg-white text-[var(--color-ink)] hover:bg-slate-50"
          }`}
        >
          <CheckIcon width={16} height={16} />
          {isChecked ? "Болих" : "Шалгасан гэж тэмдэглэх"}
        </button>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="flex gap-2.5">
      <span className={`mt-0.5 shrink-0 ${tone}`}>{icon}</span>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          {label}
        </p>
        <p className="text-[var(--color-ink)]">{value}</p>
      </div>
    </div>
  );
}
