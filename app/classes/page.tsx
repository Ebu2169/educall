"use client";

import { AppShell } from "@/components/AppShell";
import { ClassHierarchyCard } from "@/components/ClassHierarchyCard";
import {
  ChevronRightIcon,
  GraduationIcon,
  LayersIcon,
  SparkleIcon,
} from "@/components/icons";
import { classRoom, school } from "@/lib/mockData";
import { useAppState } from "@/lib/store";

const hierarchy = [
  { label: school.city, type: "Хот" },
  { label: school.district, type: "Дүүрэг" },
  { label: school.name, type: "Сургууль" },
  { label: classRoom.grade, type: "Анги" },
];

export default function ClassesPage() {
  const { submissions } = useAppState();
  const liveSubmitted = classRoom.submittedThisWeek + submissions.length;

  return (
    <AppShell
      title="Ангиуд"
      subtitle="Сургуулийн бүтэц — хот → дүүрэг → сургууль → анги"
    >
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb hierarchy */}
        <div className="animate-fade-in flex flex-wrap items-center gap-2 rounded-2xl border bg-white p-4 shadow-[var(--shadow-soft)]">
          <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <LayersIcon width={18} height={18} />
          </span>
          {hierarchy.map((h, i) => (
            <div key={h.label} className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                  {h.type}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    i === hierarchy.length - 1
                      ? "text-brand-700"
                      : "text-[var(--color-ink)]"
                  }`}
                >
                  {h.label}
                </span>
              </div>
              {i < hierarchy.length - 1 && (
                <ChevronRightIcon
                  width={16}
                  height={16}
                  className="text-[var(--color-ink-muted)]"
                />
              )}
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-soft)]">
          Сургууль, дүүрэг, анги тус бүр өөрийн{" "}
          <span className="font-semibold text-[var(--color-ink)]">
            AI ангийн контекст
          </span>
          -тэй байж болно. Доорх ангийг сонгож багшийн самбарыг нээнэ үү.
        </p>

        {/* The class card */}
        <div className="animate-fade-in mt-4 [animation-delay:80ms]">
          <ClassHierarchyCard
            classRoom={classRoom}
            liveSubmitted={liveSubmitted}
          />
        </div>

        {/* Future classes (disabled placeholders) */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {[
            { grade: "10Б анги", subject: "Математик" },
            { grade: "9А анги", subject: "Физик" },
          ].map((c) => (
            <div
              key={c.grade}
              className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/50 p-5 text-[var(--color-ink-muted)]"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-slate-100">
                <GraduationIcon width={20} height={20} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[var(--color-ink-soft)]">
                  {c.grade} — {c.subject}
                </p>
                <p className="text-xs">Удахгүй нэмэгдэнэ</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
          <SparkleIcon
            width={20}
            height={20}
            className="mt-0.5 shrink-0 text-brand-600"
          />
          <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
            Энэхүү платформ нь сургуулийн бүтэц, хичээлийн хөтөлбөр,
            харилцааг агуулж болох ч{" "}
            <span className="font-semibold text-[var(--color-ink)]">
              гол үүрэг нь хэт олон хүүхэдтэй ангид далд бэрхшээлтэй сурагчдыг
              илрүүлж, багшид эрэмбэлсэн жагсаалт өгөх явдал
            </span>{" "}
            юм.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
