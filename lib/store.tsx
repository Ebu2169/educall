"use client";

// App-wide demo state for EducAll.
//
// No backend is required for the prototype: we keep teacher actions (checked /
// feedback) and new student submissions in a small module-level store, persisted
// to localStorage so the demo survives a refresh. This is what makes the
// dashboard "conceptually update" after a student submits the diagnostic.
//
// We expose it through `useSyncExternalStore` — the hydration-safe React pattern
// for reading from an external source like localStorage without effects.

import * as React from "react";
import type { Confidence, TeacherFeedback } from "./types";

export interface DemoSubmission {
  id: string;
  studentName: string;
  // confidence is only collected for academic questions.
  answers: { questionId: string; optionId: string; confidence?: Confidence }[];
  correctCount: number;
  submittedAt: number;
}

interface AppState {
  // studentId -> checked flag set by the teacher
  checked: Record<string, boolean>;
  // studentId -> teacher feedback used as future fine-tuning data
  feedback: Record<string, TeacherFeedback>;
  // new student submissions made during the demo
  submissions: DemoSubmission[];
}

const STORAGE_KEY = "educall-demo-state-v1";

const defaultState: AppState = {
  checked: {},
  feedback: {},
  submissions: [],
};

// ---- Module-level external store -------------------------------------------

let memory: AppState = defaultState;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): AppState {
  // Lazily hydrate from localStorage the first time we read on the client.
  if (typeof window !== "undefined" && !loaded) {
    loaded = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) memory = { ...defaultState, ...(JSON.parse(raw) as AppState) };
    } catch {
      // ignore malformed storage
    }
  }
  return memory;
}

function getServerSnapshot(): AppState {
  return defaultState;
}

function update(updater: (s: AppState) => AppState) {
  memory = updater(memory);
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    }
  } catch {
    // ignore quota / privacy mode errors
  }
  emit();
}

// ---- Public actions ---------------------------------------------------------

export function markChecked(studentId: string, value = true) {
  update((s) => ({ ...s, checked: { ...s.checked, [studentId]: value } }));
}

export function setFeedback(studentId: string, value: TeacherFeedback) {
  update((s) => ({ ...s, feedback: { ...s.feedback, [studentId]: value } }));
}

export function addSubmission(submission: DemoSubmission) {
  update((s) => ({ ...s, submissions: [submission, ...s.submissions] }));
}

export function resetDemo() {
  update(() => ({ ...defaultState }));
}

// ---- Provider (passthrough, kept for a stable import surface) ---------------

export function AppStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

// ---- Hook -------------------------------------------------------------------

export interface AppStateContextValue extends AppState {
  markChecked: typeof markChecked;
  setFeedback: typeof setFeedback;
  addSubmission: typeof addSubmission;
  resetDemo: typeof resetDemo;
}

export function useAppState(): AppStateContextValue {
  const state = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  return {
    ...state,
    markChecked,
    setFeedback,
    addSubmission,
    resetDemo,
  };
}
