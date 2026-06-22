"use client";

import * as React from "react";
import type { StudentRisk, TeacherFeedback } from "@/lib/types";
import { useAppState } from "@/lib/store";
import { RiskBadge } from "./RiskBadge";
import {
  BrainIcon,
  CheckCircleIcon,
  CloseIcon,
  LightbulbIcon,
  ShieldIcon,
  SparkleIcon,
} from "./icons";

const feedbackOptions: {
  value: TeacherFeedback;
  label: string;
  tone: string;
}[] = [
  {
    value: "correct",
    label: "Зөв оношилсон",
    tone: "data-[on=true]:bg-emerald-600 data-[on=true]:text-white data-[on=true]:border-emerald-600",
  },
  {
    value: "not_accurate",
    label: "Тийм биш",
    tone: "data-[on=true]:bg-rose-600 data-[on=true]:text-white data-[on=true]:border-rose-600",
  },
  {
    value: "already_helped",
    label: "Аль хэдийн тусалсан",
    tone: "data-[on=true]:bg-brand-600 data-[on=true]:text-white data-[on=true]:border-brand-600",
  },
];

export function AIReasoningModal({
  student,
  onClose,
}: {
  student: StudentRisk | null;
  onClose: () => void;
}) {
  const { feedback, setFeedback } = useAppState();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (student) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [student, onClose]);

  if (!student) return null;

  const fb = feedback[student.studentId];
  const justSaved = !!fb;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 animate-fade-in-soft sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${student.studentName} — AI үндэслэл`}
    >
      <div
        className="animate-pop-in max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-brand-600 px-6 py-5 text-white">
          <button
            onClick={onClose}
            aria-label="Хаах"
            className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
          >
            <CloseIcon width={16} height={16} />
          </button>
          <div className="flex items-center gap-2 text-xs font-medium text-brand-100">
            <SparkleIcon width={16} height={16} /> AI үндэслэл
          </div>
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-2xl font-bold">{student.studentName}</h2>
            <RiskBadge level={student.riskLevel} className="bg-white/90" />
          </div>
          <p className="mt-1 text-sm text-brand-100">
            Эрсдэлийн оноо: {student.riskScore} / 100
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Evidence */}
          <section>
            <SectionTitle
              icon={<BrainIcon width={16} height={16} />}
              title="Нотолгоо"
            />
            <ul className="mt-2 space-y-2">
              {student.evidence.map((e, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm text-[var(--color-ink)]"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-400" />
                  {e.text}
                </li>
              ))}
            </ul>
          </section>

          {/* Interpretation */}
          <section className="rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
            <SectionTitle
              icon={<SparkleIcon width={16} height={16} />}
              title="AI тайлбар"
              tone="text-brand-700"
            />
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
              {student.interpretation}
            </p>
          </section>

          {/* Recommended action */}
          <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <SectionTitle
              icon={<LightbulbIcon width={16} height={16} />}
              title="Зөвлөмж — 5 минутын үйлдэл"
              tone="text-emerald-700"
            />
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]">
              {student.suggestedAction}
            </p>
          </section>

          {/* Caution */}
          <section className="flex gap-2.5 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <ShieldIcon
              width={18}
              height={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />
            <p className="text-sm leading-relaxed text-amber-800">
              <span className="font-semibold">Анхааруулга:</span> Энэ бол эрт
              сэрэмжлүүлэх дохио бөгөөд эцсийн дүгнэлт биш. Багшийн ажиглалтаар
              баталгаажуулна уу.
            </p>
          </section>

          {/* Teacher feedback */}
          <section>
            <SectionTitle
              icon={<CheckCircleIcon width={16} height={16} />}
              title="Багшийн санал хүсэлт"
            />
            <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
              Таны санал хүсэлт ирээдүйн загвар сайжруулах (fine-tuning) өгөгдөл
              болж хадгалагдана.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {feedbackOptions.map((opt) => (
                <button
                  key={opt.value}
                  data-on={fb === opt.value}
                  onClick={() => setFeedback(student.studentId, opt.value)}
                  className={`rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] transition-all hover:bg-slate-50 active:scale-[0.98] ${opt.tone}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {justSaved && (
              <p className="animate-fade-in mt-3 inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                <CheckCircleIcon width={15} height={15} />
                Хадгалагдлаа — сургалтын өгөгдөлд нэмэгдсэн.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  tone = "text-[var(--color-ink)]",
}: {
  icon: React.ReactNode;
  title: string;
  tone?: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 text-sm font-bold ${tone}`}>
      {icon}
      {title}
    </div>
  );
}
