"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "./AppShell";
import { RiskBadge } from "./RiskBadge";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckIcon,
  InboxIcon,
  SparkleIcon,
  UsersIcon,
} from "./icons";
import { roster } from "@/lib/mockData";
import { analyzeSubmission } from "@/lib/analyze";
import { useAppState } from "@/lib/store";
import type { RosterStudent } from "@/lib/types";

export type RosterViewId = "all" | "submitted" | "struggling" | "urgent";

const VIEWS: {
  id: RosterViewId;
  label: string;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "all",
    label: "Нийт сурагч",
    title: "Бүх сурагч",
    subtitle: "Ангийн бүрэн жагсаалт",
  },
  {
    id: "submitted",
    label: "Илгээсэн",
    title: "Энэ долоо хоног илгээсэн",
    subtitle: "Оношлогоог бөглөсөн сурагчид",
  },
  {
    id: "struggling",
    label: "Бэрхшээлийн дохио",
    title: "Бэрхшээлийн дохио өгсөн",
    subtitle: "Магадлалт бэрхшээлтэй сурагчид",
  },
  {
    id: "urgent",
    label: "Яаралтай анхаарал",
    title: "Яаралтай анхаарал шаардаж буй",
    subtitle: "Энэ долоо хоног эхэлж үзэх сурагчид",
  },
];

function initials(name: string) {
  return name.trim().slice(0, 1).toUpperCase();
}

export function RosterView({ view }: { view: RosterViewId }) {
  const { submissions } = useAppState();
  const [query, setQuery] = React.useState("");

  const meta = VIEWS.find((v) => v.id === view)!;

  // Convert live demo submissions into roster-shaped rows (tagged "new").
  const liveRows = React.useMemo(
    () =>
      submissions.map((sub) => {
        const { risk } = analyzeSubmission(sub);
        const row: RosterStudent & { isNew: boolean } = {
          id: sub.id,
          name: sub.studentName,
          submitted: true,
          struggling: risk.riskLevel !== "low",
          attention: risk.riskLevel !== "low",
          riskLevel: risk.riskLevel,
          note: risk.conceptGap,
          isNew: true,
        };
        return row;
      }),
    [submissions],
  );

  // Base roster filtered for this view.
  const baseRows = React.useMemo(() => {
    switch (view) {
      case "submitted":
        return roster.filter((r) => r.submitted);
      case "struggling":
        return roster.filter((r) => r.struggling);
      case "urgent":
        return roster.filter((r) => r.attention);
      default:
        return roster;
    }
  }, [view]);

  // Which live rows belong in this view.
  const liveForView = liveRows.filter((r) => {
    if (view === "all" || view === "submitted") return true;
    return r.struggling; // struggling + urgent
  });

  const allRows = [...liveForView, ...baseRows];
  const filtered = query.trim()
    ? allRows.filter((r) =>
        r.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : allRows;

  return (
    <AppShell
      title={meta.title}
      subtitle={`${meta.subtitle} · 10А анги`}
      actions={
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-[var(--color-ink)] transition-all hover:bg-slate-50"
        >
          Самбар руу буцах
        </Link>
      }
    >
      {/* View tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {VIEWS.map((v) => {
          const active = v.id === view;
          return (
            <Link
              key={v.id}
              href={`/dashboard/roster/${v.id}`}
              className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-[var(--color-ink-soft)] hover:bg-slate-50"
              }`}
            >
              {v.label}
            </Link>
          );
        })}
      </div>

      {/* Count + search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 shadow-[var(--shadow-soft)] ring-1 ring-slate-100">
          <UsersIcon width={18} height={18} className="text-brand-600" />
          <span className="text-sm text-[var(--color-ink-soft)]">
            Нийт:{" "}
            <span className="text-base font-bold text-[var(--color-ink)]">
              {allRows.length}
            </span>{" "}
            сурагч
          </span>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Нэрээр хайх…"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </div>

      {/* List */}
      <div className="mt-4 overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-soft)]">
        <ul className="divide-y divide-slate-100 stagger">
          {filtered.map((r) => {
            const isNew = "isNew" in r && (r as { isNew?: boolean }).isNew;
            return (
              <li
                key={r.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/70"
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg text-sm font-bold text-white ${
                    r.attention
                      ? "bg-rose-500"
                      : r.struggling
                        ? "bg-amber-500"
                        : "bg-slate-400"
                  }`}
                >
                  {initials(r.name)}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[var(--color-ink)]">
                      {r.name}
                    </p>
                    {isNew && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        <SparkleIcon width={10} height={10} /> ШИНЭ
                      </span>
                    )}
                  </div>
                  {r.note && (
                    <p className="text-xs text-[var(--color-ink-soft)]">
                      {r.note}
                    </p>
                  )}
                </div>

                <div className="ml-auto flex items-center gap-2">
                  {r.submitted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <CheckIcon width={12} height={12} /> Илгээсэн
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      <InboxIcon width={12} height={12} /> Илгээгээгүй
                    </span>
                  )}
                  {r.attention && r.riskLevel ? (
                    <RiskBadge level={r.riskLevel} />
                  ) : r.struggling ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        r.note && isWellbeingTag2(r.note)
                          ? "bg-violet-50 text-violet-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <AlertIcon width={12} height={12} /> Бэрхшээлтэй
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}

          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-[var(--color-ink-muted)]">
              «{query}» нэртэй сурагч олдсонгүй.
            </li>
          )}
        </ul>
      </div>

      <Link
        href="/dashboard"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        Багшийн самбар руу буцах
        <ArrowRightIcon width={15} height={15} />
      </Link>
    </AppShell>
  );
}

// The roster notes are plain labels; this matches the two wellbeing labels so
// the chip can be tinted appropriately without threading the raw tag through.
function isWellbeingTag2(note: string): boolean {
  return note === "Сэтгэл санааны дэмжлэг" || note === "Холбоо тогтоох хэрэгцээ";
}
