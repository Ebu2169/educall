"use client";

import type { Confidence, DiagnosticQuestion } from "@/lib/types";
import { CheckIcon } from "./icons";

const confidenceOptions: { value: Confidence; label: string }[] = [
  { value: "not_sure", label: "Эргэлзэж байна" },
  { value: "somewhat_sure", label: "Бага зэрэг итгэлтэй" },
  { value: "very_sure", label: "Маш итгэлтэй" },
];

export function DiagnosticQuestionCard({
  question,
  index,
  total,
  selectedOption,
  confidence,
  onSelectOption,
  onSelectConfidence,
}: {
  question: DiagnosticQuestion;
  index: number;
  total: number;
  selectedOption?: string;
  confidence?: Confidence;
  onSelectOption: (optionId: string) => void;
  onSelectConfidence: (c: Confidence) => void;
}) {
  const isWellbeing = question.kind === "wellbeing";

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="flex items-center gap-2 text-brand-600">
          <span className="grid size-6 place-items-center rounded-full bg-brand-50">
            {index + 1}
          </span>
          Асуулт {index + 1} / {total}
        </span>
        <span
          className={`ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${
            isWellbeing
              ? "bg-violet-50 text-violet-700"
              : "bg-brand-50 text-brand-700"
          }`}
        >
          {isWellbeing ? "Сайн сайхан байдал" : "Хичээл"}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold leading-snug text-[var(--color-ink)]">
        {question.prompt}
      </h3>

      {/* Options */}
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {question.options.map((opt) => {
          const selected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectOption(opt.id)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.99] ${
                selected
                  ? "border-brand-400 bg-brand-50 text-brand-800 ring-1 ring-brand-300"
                  : "border-slate-200 bg-white text-[var(--color-ink)] hover:border-brand-200 hover:bg-brand-50/40"
              }`}
            >
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
                  selected
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {selected && <CheckIcon width={12} height={12} />}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Confidence selector — academic questions only */}
      {!isWellbeing && (
        <div className="mt-4 border-t border-dashed border-slate-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Хэр итгэлтэй байна вэ?
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {confidenceOptions.map((c) => {
              const active = confidence === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => onSelectConfidence(c.value)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all active:scale-[0.97] ${
                    active
                      ? "bg-[var(--color-ink)] text-white"
                      : "bg-slate-100 text-[var(--color-ink-soft)] hover:bg-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isWellbeing && (
        <p className="mt-4 border-t border-dashed border-slate-200 pt-4 text-xs leading-relaxed text-[var(--color-ink-muted)]">
          Энд зөв буруу хариулт байхгүй. Чин үнэнээ хуваалцвал багш чамд илүү сайн
          туслах боломжтой.
        </p>
      )}
    </div>
  );
}
