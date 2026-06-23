"use client";

import * as React from "react";
import { DiagnosticQuestionCard } from "@/components/DiagnosticQuestionCard";
import { StudentBottomNav } from "@/components/StudentBottomNav";
import { ClassroomChat } from "@/components/ClassroomChat";
import { BrandMark } from "@/components/BrandMark";
import {
  ArrowRightIcon,
  BookIcon,
  CheckCircleIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/icons";
import { CLASS_CODE, classRoom } from "@/lib/mockData";
import { generateWeeklyDiagnostic } from "@/lib/copilot";
import { useAppState } from "@/lib/store";
import type { Confidence } from "@/lib/types";

type Phase = "intro" | "quiz" | "done";
type Answer = { optionId?: string; confidence?: Confidence };

const { questions, topic } = generateWeeklyDiagnostic(
  classRoom.topic,
  classRoom.grade,
);

export default function DiagnosticPage() {
  const { addSubmission, session } = useAppState();
  // When the student arrived via the login page we already have their name —
  // don't ask for it (or the class code) again, that felt like a second login.
  const loggedInName = session?.role === "student" ? session.name : "";
  const isLoggedIn = loggedInName.trim().length > 0;

  const [phase, setPhase] = React.useState<Phase>("intro");
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState(CLASS_CODE);
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, Answer>>({});

  const current = questions[step];
  const currentAnswer = answers[current?.id] ?? {};
  // Academic questions also require a confidence rating; wellbeing ones don't.
  const needsConfidence = current?.kind === "academic";
  const canAdvance =
    !!currentAnswer.optionId && (!needsConfidence || !!currentAnswer.confidence);
  const isLast = step === questions.length - 1;
  const progress = Math.round(((step + 1) / questions.length) * 100);

  function setOption(optionId: string) {
    setAnswers((a) => ({ ...a, [current.id]: { ...a[current.id], optionId } }));
  }
  function setConfidence(confidence: Confidence) {
    setAnswers((a) => ({
      ...a,
      [current.id]: { ...a[current.id], confidence },
    }));
  }

  function submit() {
    const items = questions.map((q) => ({
      questionId: q.id,
      optionId: answers[q.id]!.optionId!,
      confidence: answers[q.id]?.confidence,
    }));
    const correctCount = items.filter(
      (it) =>
        questions
          .find((q) => q.id === it.questionId)
          ?.options.find((o) => o.id === it.optionId)?.correct,
    ).length;

    addSubmission({
      id: `sub-${Date.now()}`,
      studentName: (loggedInName || name).trim() || "Сурагч",
      answers: items,
      correctCount,
      submittedAt: Date.now(),
    });
    setPhase("done");
  }

  function restart() {
    setPhase("intro");
    setStep(0);
    setAnswers({});
    setName("");
    setCode(CLASS_CODE);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Light student header */}
      <header className="sticky top-0 z-20 border-b border-[var(--color-line)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="flex items-center gap-2.5">
            <BrandMark size={36} />
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">EducAll</p>
              <p className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                Сурагчийн оношлогоо
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
            <BookIcon width={13} height={13} />
            Долоо хоногийн оношлогоо
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-28 pt-7 sm:px-5 sm:pt-10">
        {/* INTRO */}
        {phase === "intro" && (
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <BookIcon width={14} height={14} />
              {topic}
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Энэ долоо хоногийн богино оношлогоо
            </h1>
            <p className="mt-2 text-[var(--color-ink-soft)]">
              {questions.length} богино асуулт — хичээлийн ойлголт ба{" "}
              <span className="font-semibold text-[var(--color-ink)]">
                таны сайн сайхан байдлын
              </span>{" "}
              тухай. Зөв хариулахаас илүү чин үнэнээ хуваалцах нь чухал. Энэ нь
              багшид хэнд, юугаар туслахаа ойлгоход хэрэгтэй.
            </p>

            <div className="mt-6 space-y-4 rounded-2xl border bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
              {isLoggedIn ? (
                <div className="flex items-center gap-3 rounded-xl bg-brand-50 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-600 text-base font-bold text-white">
                    {loggedInName.trim().slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-ink)]">
                      Сайн уу, {loggedInName}!
                    </p>
                    <p className="text-xs text-[var(--color-ink-soft)]">
                      {classRoom.grade} · Бэлэн болсон бол эхэлцгээе.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Field label="Нэр">
                    <div className="relative">
                      <UsersIcon
                        width={18}
                        height={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
                      />
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Жишээ нь: Хулан"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-[var(--color-ink)] outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                      />
                    </div>
                  </Field>

                  <Field label="Ангийн код">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="UB-BZD-TOM-10A"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-[var(--color-ink)] outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                    />
                    <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">
                      Багшаас өгсөн ангийн код. Демо код:{" "}
                      <span className="font-mono font-semibold">{CLASS_CODE}</span>
                    </p>
                  </Field>
                </>
              )}

              <button
                onClick={() => setPhase("quiz")}
                disabled={!isLoggedIn && !name.trim()}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Эхлэх
                <ArrowRightIcon
                  width={18}
                  height={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {phase === "quiz" && current && (
          <div className="animate-fade-in">
            {/* progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-ink-soft)]">
                <span>
                  Асуулт {step + 1} / {questions.length}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <DiagnosticQuestionCard
              key={current.id}
              question={current}
              index={step}
              total={questions.length}
              selectedOption={currentAnswer.optionId}
              confidence={currentAnswer.confidence}
              onSelectOption={setOption}
              onSelectConfidence={setConfidence}
            />

            {/* Action bar — sticks just above the bottom nav on mobile so the
                primary button is always within thumb reach. */}
            <div className="sticky bottom-16 z-10 -mx-4 mt-5 flex items-center gap-3 border-t border-[var(--color-line)] bg-white/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[var(--color-ink-soft)] transition-all hover:bg-slate-50 disabled:opacity-40 sm:py-2.5"
              >
                Буцах
              </button>
              {isLast ? (
                <button
                  onClick={submit}
                  disabled={!canAdvance}
                  className="ml-auto inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:text-sm"
                >
                  <CheckCircleIcon width={18} height={18} />
                  Илгээх
                </button>
              ) : (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canAdvance}
                  className="group ml-auto inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:text-sm"
                >
                  Дараах
                  <ArrowRightIcon
                    width={17}
                    height={17}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              )}
            </div>
          </div>
        )}

        {/* DONE */}
        {phase === "done" && (
          <div className="animate-pop-in text-center">
            <div className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-500">
              <CheckCircleIcon width={44} height={44} />
            </div>
            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[var(--color-ink)]">
              Илгээгдлээ. Баярлалаа!
            </h1>
            <p className="mx-auto mt-2 max-w-md text-[var(--color-ink-soft)]">
              Таны багш үүнийг ангид хаана дэмжлэг хэрэгтэйг ойлгоход ашиглана.
            </p>

            <div className="mx-auto mt-6 flex max-w-sm items-start gap-2.5 rounded-2xl border border-brand-100 bg-brand-50/50 p-4 text-left">
              <ShieldIcon
                width={20}
                height={20}
                className="mt-0.5 shrink-0 text-brand-600"
              />
              <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                Энэ нь шалгалт биш. Зөв/буруу оноо чамд харагдахгүй — зорилго нь
                ангид туслах явдал юм.
              </p>
            </div>

            <div className="mt-7 flex justify-center">
              <button
                onClick={restart}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-[var(--color-ink)] transition-all hover:bg-slate-50 active:scale-[0.98]"
              >
                <ArrowRightIcon width={18} height={18} />
                Дахин бөглөх
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Classroom AI assistant (floating) + decorative app nav */}
      <ClassroomChat />
      <StudentBottomNav />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">
        {label}
      </label>
      {children}
    </div>
  );
}
