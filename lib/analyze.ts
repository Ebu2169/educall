// Shared helpers for turning live demo submissions into analyzed risk profiles.
// Used by both the dashboard and the class roster detail pages so the live
// "conceptual update" stays consistent across screens.

import { weeklyDiagnostic } from "./mockData";
import { analyzeStudentResponses } from "./copilot";
import type { DemoSubmission } from "./store";
import type { StudentResponses, StudentRisk } from "./types";

export const academicQuestionIds = new Set(
  weeklyDiagnostic.filter((q) => q.kind === "academic").map((q) => q.id),
);

export function submissionToResponses(sub: DemoSubmission): StudentResponses {
  const byId = new Map(weeklyDiagnostic.map((q) => [q.id, q]));
  return {
    studentId: sub.id,
    studentName: sub.studentName,
    submitted: true,
    items: sub.answers.map((a) => {
      const q = byId.get(a.questionId);
      const correct = !!q?.options.find((o) => o.id === a.optionId)?.correct;
      return {
        questionId: a.questionId,
        optionId: a.optionId,
        correct,
        confidence: a.confidence,
      };
    }),
  };
}

export function analyzeSubmission(sub: DemoSubmission): {
  risk: StudentRisk;
  correctCount: number;
  total: number;
} {
  const responses = submissionToResponses(sub);
  return {
    risk: analyzeStudentResponses(responses),
    correctCount: responses.items.filter(
      (i) => academicQuestionIds.has(i.questionId) && i.correct,
    ).length,
    total: academicQuestionIds.size,
  };
}
