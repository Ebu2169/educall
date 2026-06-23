"use client";

import * as React from "react";
import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StudentRiskCard } from "@/components/StudentRiskCard";
import { CopilotInsightCard } from "@/components/CopilotInsightCard";
import { MisconceptionChart } from "@/components/MisconceptionChart";
import { AIReasoningModal } from "@/components/AIReasoningModal";
import { RiskBadge } from "@/components/RiskBadge";
import {
  AlertIcon,
  BrainIcon,
  CheckCircleIcon,
  InboxIcon,
  SparkleIcon,
  UsersIcon,
} from "@/components/icons";
import {
  attentionStudents,
  classRoom,
  misconceptionBuckets,
} from "@/lib/mockData";
import { CONCEPT_LABEL, generateClassSummary } from "@/lib/copilot";
import { analyzeSubmission } from "@/lib/analyze";
import { useAppState } from "@/lib/store";
import type { MisconceptionBucket, StudentRisk } from "@/lib/types";

// Fold the live (non-low) submissions into the class misconception buckets so
// the chart visibly grows as students submit. New concept categories are added
// on the fly using their human-readable label.
function buildLiveBuckets(
  base: MisconceptionBucket[],
  contributors: StudentRisk[],
): MisconceptionBucket[] {
  const map = new Map(base.map((b) => [b.tag, { ...b }]));
  for (const s of contributors) {
    const existing = map.get(s.conceptTag);
    if (existing) {
      existing.studentCount += 1;
    } else {
      map.set(s.conceptTag, {
        tag: s.conceptTag,
        label: CONCEPT_LABEL[s.conceptTag],
        studentCount: 1,
      });
    }
  }
  return [...map.values()].sort((a, b) => b.studentCount - a.studentCount);
}

export default function DashboardPage() {
  const { submissions } = useAppState();
  const [active, setActive] = React.useState<StudentRisk | null>(null);

  // Live analysis of every student who submitted during the demo. Each
  // submission is paired with its analyzed risk profile + academic score.
  const liveResults = React.useMemo(
    () =>
      submissions.map((sub) => {
        const { risk, correctCount, total } = analyzeSubmission(sub);
        return { sub, risk, correctCount, total };
      }),
    [submissions],
  );

  const liveAnalyzed = liveResults.map((r) => r.risk);
  const liveSubmitted = classRoom.submittedThisWeek + submissions.length;

  // Non-low new submissions are the ones that actually need teacher attention.
  const newlyFlagged = liveAnalyzed.filter((s) => s.riskLevel !== "low");
  const newIds = new Set(newlyFlagged.map((s) => s.studentId));
  const rankedStudents = [...newlyFlagged, ...attentionStudents];

  // Live-updating chart + summary.
  const liveBuckets = React.useMemo(
    () => buildLiveBuckets(misconceptionBuckets, newlyFlagged),
    [newlyFlagged],
  );
  const summary = React.useMemo(
    () => generateClassSummary(liveBuckets),
    [liveBuckets],
  );

  const strugglingCount = classRoom.strugglingCount + newlyFlagged.length;
  const urgentCount = classRoom.needAttentionCount + newlyFlagged.length;

  return (
    <AppShell
      title="10А анги — Хичээлийн Copilot"
      subtitle={`${classRoom.topic} · Ангийн код ${classRoom.classCode}`}
      actions={
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">
          <SparkleIcon width={14} height={14} />
          <span className="hidden sm:inline">Багшийн самбар</span>
          <span className="sm:hidden">Багш</span>
        </span>
      }
    >
      {/* Live analysis of new submissions (shows EVERY submission, any risk) */}
      {liveResults.length > 0 && (
        <div className="animate-fade-in mb-6 overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-4 py-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-600">
              <InboxIcon width={20} height={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--color-ink)]">
                {liveResults.length} шинэ илгээлтийг Copilot шинжиллээ
              </p>
              <p className="text-xs text-[var(--color-ink-soft)]">
                Долоо хоногийн оношлогоо · бодит цагийн дүн шинжилгээ
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-200">
              <SparkleIcon width={14} height={14} /> Live
            </span>
          </div>

          <ul className="divide-y divide-slate-100">
            {liveResults.map(({ sub, risk, correctCount, total }) => (
              <li
                key={sub.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                  {sub.studentName.trim().slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--color-ink)]">
                    {sub.studentName}
                  </p>
                  <p className="text-xs text-[var(--color-ink-soft)]">
                    {correctCount}/{total} зөв · {risk.conceptGap}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2.5">
                  <span className="hidden text-xs font-semibold text-[var(--color-ink-soft)] sm:inline">
                    Оноо {risk.riskScore}
                  </span>
                  <RiskBadge level={risk.riskLevel} />
                  <button
                    onClick={() => setActive(risk)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                  >
                    <BrainIcon width={14} height={14} />
                    <span className="hidden sm:inline">AI үндэслэл</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Нийт сурагч"
          value={classRoom.totalStudents}
          icon={<UsersIcon width={20} height={20} />}
          tone="brand"
          hint="10А анги · Математик"
          href="/dashboard/roster/all"
        />
        <StatCard
          label="Энэ долоо хоног илгээсэн"
          value={liveSubmitted}
          icon={<InboxIcon width={20} height={20} />}
          tone="mint"
          hint={`${Math.round((liveSubmitted / classRoom.totalStudents) * 100)}% оролцоо${submissions.length ? ` · +${submissions.length} шинэ` : ""}`}
          href="/dashboard/roster/submitted"
        />
        <StatCard
          label="Бэрхшээлийн дохио"
          value={strugglingCount}
          icon={<AlertIcon width={20} height={20} />}
          tone="amber"
          hint="Магадлалт бэрхшээлтэй"
          href="/dashboard/roster/struggling"
        />
        <StatCard
          label="Яаралтай анхаарал"
          value={urgentCount}
          icon={<AlertIcon width={20} height={20} />}
          tone="rose"
          urgent
          hint="Энэ долоо хоног эхэлж үзэх"
          href="/dashboard/roster/urgent"
        />
      </div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: ranked students */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--color-ink)]">
                Энэ долоо хоног анхаарал шаардаж буй сурагчид
              </h2>
              <p className="text-sm text-[var(--color-ink-soft)]">
                Эрсдэлээр эрэмбэлсэн · багшийн анхаарал чиглүүлэгч
              </p>
            </div>
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-[var(--color-ink-soft)] sm:inline">
              {rankedStudents.length} сурагч
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            {rankedStudents.map((s, i) => (
              <div key={s.studentId} className="relative">
                {newIds.has(s.studentId) && (
                  <span className="absolute -top-2 left-12 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    <SparkleIcon width={11} height={11} /> ШИНЭ
                  </span>
                )}
                <StudentRiskCard
                  student={s}
                  rank={i + 1}
                  onViewReasoning={setActive}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Right: copilot + chart */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <CopilotInsightCard summary={summary} />
          <MisconceptionChart
            buckets={liveBuckets}
            total={classRoom.totalStudents}
          />

          {/* Empty-state: students submit from their own phones */}
          {submissions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-4">
              <p className="flex items-center gap-1.5 text-sm font-bold text-brand-700">
                <CheckCircleIcon width={16} height={16} /> Хариултыг хүлээж байна
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-ink-soft)]">
                Сурагчид утаснаасаа{" "}
                <span className="font-mono font-semibold text-[var(--color-ink)]">
                  {classRoom.classCode}
                </span>{" "}
                кодоор оношлогоог бөглөнө. Хариулт ирэх бүрд Copilot энэ самбар
                дээр шууд шинжилж харуулна.
              </p>
            </div>
          )}
        </aside>
      </div>

      <AIReasoningModal student={active} onClose={() => setActive(null)} />
    </AppShell>
  );
}
