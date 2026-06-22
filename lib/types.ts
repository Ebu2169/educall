// Core domain types for Classroom Copilot.
// Kept framework-agnostic so the same shapes can flow through a real
// backend / LLM service later without UI changes.

export type RiskLevel = "high" | "medium" | "low";

// Concept / signal tags. These double as the "labels" an LLM classifier
// (or a LoRA fine-tune) would predict per student response set. The diagnostic
// is intentionally NOT purely academic: alongside misconceptions we capture
// wellbeing + connection signals so the teacher can also strengthen the
// teacher–student relationship, not just fix math gaps.
export type ConceptTag =
  // academic
  | "denominator_size_misconception"
  | "equivalent_fraction_confusion"
  | "low_confidence"
  | "missed_submission"
  | "word_problem_application"
  // wellbeing / connection
  | "low_wellbeing"
  | "wants_connection";

// What a diagnostic question measures.
export type QuestionKind = "academic" | "wellbeing";

export type Confidence = "not_sure" | "somewhat_sure" | "very_sure";

export type TeacherFeedback = "correct" | "not_accurate" | "already_helped";

export interface School {
  id: string;
  city: string;
  district: string;
  name: string;
}

export interface ClassRoom {
  id: string;
  schoolId: string;
  grade: string;
  subject: string;
  classCode: string;
  totalStudents: number;
  submittedThisWeek: number;
  strugglingCount: number;
  needAttentionCount: number;
  weeklyActive: boolean;
  topic: string;
}

export interface DiagnosticOption {
  id: string;
  label: string;
  // For academic questions only.
  correct?: boolean;
  // For wellbeing questions: choosing this option raises the given signal.
  signal?: ConceptTag;
}

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  kind: QuestionKind;
  options: DiagnosticOption[];
  // Concept this question probes — used by the analyzer to attribute gaps.
  concept: ConceptTag;
}

// A single answer a student gives to one question.
export interface ResponseItem {
  questionId: string;
  optionId: string;
  correct: boolean;
  // Wellbeing questions don't collect a confidence rating.
  confidence?: Confidence;
}

// Full submission of one student for the week.
export interface StudentResponses {
  studentId: string;
  studentName: string;
  submitted: boolean;
  items: ResponseItem[];
}

// A piece of evidence the Copilot surfaces to justify a risk signal.
export interface EvidenceItem {
  text: string;
}

// The analyzed, teacher-facing risk profile for one student.
export interface StudentRisk {
  studentId: string;
  studentName: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  conceptTag: ConceptTag;
  conceptGap: string; // human readable "likely gap"
  reason: string;
  suggestedAction: string;
  evidence: EvidenceItem[];
  interpretation: string;
}

export interface MisconceptionBucket {
  tag: ConceptTag;
  label: string;
  studentCount: number;
}

// A lightweight roster entry for the class-wide list/detail pages.
export interface RosterStudent {
  id: string;
  name: string;
  submitted: boolean;
  struggling: boolean;
  attention: boolean;
  riskLevel?: RiskLevel;
  note?: string; // concept gap / status text
}

export interface ClassSummary {
  headline: string;
  body: string;
}
