// =============================================================================
// EducAll Classroom Copilot — simulated LLM layer
// =============================================================================
//
// This module is the "AI" of the prototype. For the hackathon it is rule-based
// and fully deterministic so the demo works instantly with NO API keys and NO
// network. The function signatures and return shapes are intentionally designed
// so that each body could be swapped for a real model call later:
//
//   PRODUCTION DROP-IN OPTIONS
//   --------------------------
//   • Qwen via Ollama        →  POST http://localhost:11434/api/generate
//   • Llama 3 (local/served) →  any OpenAI-compatible endpoint
//   • Mistral                →  Mistral API or self-hosted
//   • Hugging Face Inference  →  https://api-inference.huggingface.co/models/...
//   • LoRA fine-tuned model   →  base open-source model + adapter trained on the
//                                teacher feedback collected in the UI
//
// The flow is "rubric-guided": each function builds a structured prompt from a
// teaching rubric (the concept tags + thresholds below) and would ask the model
// to fill in the gaps. Teacher feedback captured in the dashboard becomes the
// labeled dataset for the future fine-tune.

import type {
  ClassSummary,
  ConceptTag,
  DiagnosticQuestion,
  EvidenceItem,
  MisconceptionBucket,
  RiskLevel,
  StudentResponses,
  StudentRisk,
} from "./types";
import { weeklyDiagnostic } from "./mockData";

// Human-readable label for each concept tag (also used in the UI).
export const CONCEPT_LABEL: Record<ConceptTag, string> = {
  denominator_size_misconception: "Ялгаатай хуваарь харьцуулах",
  equivalent_fraction_confusion: "Тэнцүү бутархай",
  low_confidence: "Итгэл бага / таамаглал",
  missed_submission: "Илгээгээгүй",
  word_problem_application: "Үгэн бодлого",
  low_wellbeing: "Сэтгэл санааны дэмжлэг",
  wants_connection: "Холбоо тогтоох хэрэгцээ",
};

// Whether a concept tag is about wellbeing/connection rather than academics.
// Used by the UI to frame the signal differently (reach out vs. re-teach).
export function isWellbeingTag(tag: ConceptTag): boolean {
  return tag === "low_wellbeing" || tag === "wants_connection";
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  high: "Өндөр эрсдэл",
  medium: "Дунд эрсдэл",
  low: "Бага эрсдэл",
};

// -----------------------------------------------------------------------------
// 1. generateWeeklyDiagnostic(topic, grade)
// -----------------------------------------------------------------------------
// In production: ask the model to author 5–7 short, curriculum-aligned items for
// the given topic + grade, each tagged with the concept it probes. Here we
// return the pre-authored fraction set, but the signature is the contract.
export function generateWeeklyDiagnostic(
  topic: string,
  grade: string,
): { topic: string; grade: string; questions: DiagnosticQuestion[] } {
  // PROMPT (illustrative):
  //   "You are a math teacher's assistant. Write 5-7 short diagnostic MCQs for
  //    {grade} on the topic '{topic}'. Tag each with the misconception it
  //    detects. Keep language simple and in Mongolian."
  return { topic, grade, questions: weeklyDiagnostic };
}

// -----------------------------------------------------------------------------
// 2. analyzeStudentResponses(studentResponses)
// -----------------------------------------------------------------------------
// Turns raw answers into a teacher-facing risk profile. The scoring rubric:
//   • each missed question increases risk
//   • a WRONG answer marked "very sure" is the strongest signal (misconception)
//   • correct answers marked "not sure" → low_confidence
//   • no submission → missed_submission (we cannot judge academics yet)
export function analyzeStudentResponses(
  responses: StudentResponses,
  questions: DiagnosticQuestion[] = weeklyDiagnostic,
): StudentRisk {
  const byId = new Map(questions.map((q) => [q.id, q]));

  if (!responses.submitted || responses.items.length === 0) {
    return {
      studentId: responses.studentId,
      studentName: responses.studentName,
      riskLevel: "medium",
      riskScore: 48,
      conceptTag: "missed_submission",
      conceptGap: "Нотолгоо дутуу",
      reason: "Энэ долоо хоногийн оношлогоог илгээгээгүй.",
      suggestedAction:
        "Хичээлээс хоцорсон эсвэл системд хандах асуудал байгаа эсэхийг эхэлж шалга.",
      evidence: [{ text: "Энэ долоо хоног ямар ч хариулт ирээгүй." }],
      interpretation:
        "Хариулт байхгүй тул академик дүгнэлт хийх боломжгүй. Эхлээд хандалт/ирцийг шалгах нь зүйтэй.",
    };
  }

  let score = 0;
  const evidence: EvidenceItem[] = [];
  const wrongConcepts: ConceptTag[] = [];
  const wellbeingSignals: ConceptTag[] = [];
  let confidentlyWrong = false;
  let correctButUnsure = 0;

  for (const item of responses.items) {
    const q = byId.get(item.questionId);
    if (!q) continue;

    // Wellbeing / connection questions: no right answer — we look for signals.
    if (q.kind === "wellbeing") {
      const opt = q.options.find((o) => o.id === item.optionId);
      if (opt?.signal) {
        wellbeingSignals.push(opt.signal);
        // Emotional distress weighs a bit more than a connection nudge.
        score += opt.signal === "low_wellbeing" ? 34 : 30;
        evidence.push({
          text: `«${q.prompt}» — «${opt.label}» гэж хариулсан.`,
        });
      }
      continue;
    }

    if (!item.correct) {
      wrongConcepts.push(q.concept);
      score += 28;
      if (item.confidence === "very_sure") {
        confidentlyWrong = true;
        score += 18; // confidently wrong = entrenched misconception
        evidence.push({
          text: `«${q.prompt}» асуултад итгэлтэйгээр буруу хариулсан.`,
        });
      } else {
        evidence.push({ text: `«${q.prompt}» асуултад алдсан.` });
      }
    } else if (item.confidence === "not_sure") {
      correctButUnsure += 1;
      score += 10;
    }
  }

  const riskScore = clamp(score, 0, 100);
  const riskLevel: RiskLevel =
    riskScore >= 70 ? "high" : riskScore >= 40 ? "medium" : "low";

  if (correctButUnsure > 0) {
    evidence.push({
      text: `${correctButUnsure} зөв хариултдаа «Эргэлзэж байна» гэж тэмдэглэсэн.`,
    });
  }

  // Clean pass: everything correct, confident, and no wellbeing flag → no gap.
  // We still return a profile so the teacher sees the submission was analyzed.
  const cleanPass =
    wrongConcepts.length === 0 &&
    correctButUnsure === 0 &&
    wellbeingSignals.length === 0;
  if (cleanPass) {
    return {
      studentId: responses.studentId,
      studentName: responses.studentName,
      riskLevel: "low",
      riskScore,
      conceptTag: "word_problem_application",
      conceptGap: "Тогтвортой ахиц",
      reason: "Бүх асуултад зөв, итгэлтэй хариулсан.",
      suggestedAction: "Шаардлагагүй — тогтвортой ахиц харагдаж байна.",
      evidence:
        evidence.length > 0
          ? evidence
          : [{ text: "Бүх асуултад зөв хариулсан." }],
      interpretation: `${responses.studentName} энэ долоо хоногийн сэдвийг сайн эзэмшсэн байна. Тусгай арга хэмжээ шаардлагагүй.`,
    };
  }

  // Determine the dominant signal (academic gap or wellbeing/connection need).
  const conceptTag: ConceptTag = pickDominantConcept(
    wrongConcepts,
    wellbeingSignals,
  );

  return {
    studentId: responses.studentId,
    studentName: responses.studentName,
    riskLevel,
    riskScore,
    conceptTag,
    conceptGap: CONCEPT_LABEL[conceptTag],
    reason: buildReason(conceptTag, confidentlyWrong, correctButUnsure),
    suggestedAction: actionForConcept(conceptTag, responses.studentName),
    evidence,
    interpretation: interpretationForConcept(conceptTag, responses.studentName),
  };
}

// -----------------------------------------------------------------------------
// 3. generateTeacherRecommendation(student, evidence)
// -----------------------------------------------------------------------------
// Produces the "5-minute action" a teacher can take. In production the model
// would personalise this using the class context + the student's history.
export function generateTeacherRecommendation(
  student: Pick<StudentRisk, "studentName" | "conceptTag">,
  evidence: EvidenceItem[],
): string {
  // In production the model would weave the specific evidence into the advice;
  // the rubric version maps the dominant concept to a concrete 5-minute action.
  void evidence;
  return actionForConcept(student.conceptTag, student.studentName);
}

// -----------------------------------------------------------------------------
// 4. generateClassSummary(classData)
// -----------------------------------------------------------------------------
// One-paragraph "Copilot summary" for the whole class. In production: feed the
// aggregated misconception buckets to the model and ask for a focused, warm,
// actionable summary for tomorrow's lesson.
export function generateClassSummary(
  buckets: MisconceptionBucket[],
): ClassSummary {
  const academic = buckets
    .filter((b) => !isWellbeingTag(b.tag))
    .sort((a, b) => b.studentCount - a.studentCount);
  const wellbeing = buckets
    .filter((b) => isWellbeingTag(b.tag))
    .sort((a, b) => b.studentCount - a.studentCount);

  const topAcademic = academic[0];
  const wellbeingTotal = wellbeing.reduce((n, b) => n + b.studentCount, 0);

  let body =
    "Ихэнх сурагчид бутархайн үндсэн дүрслэлийг ойлгож байгаа боловч олонх нь " +
    "хуваарийн хэмжээг бүхэл тооны хэмжээтэй адилтган харьцуулж байна. " +
    `Хамгийн их давтагдсан академик бэрхшээл: «${topAcademic?.label ?? ""}» (${topAcademic?.studentCount ?? 0} сурагч). ` +
    "Маргаашийн дасгалаа 1/3, 1/4, 1/5-ийг дүрсээр харьцуулахад зориулаарай.";

  if (wellbeingTotal > 0) {
    body +=
      ` Мөн ${wellbeingTotal} сурагч сэтгэл санаа эсвэл холбооны дохио өгсөн — ` +
      "тэдэнтэй богино, найрсаг ярилцлага хийх нь хичээлээс өмнө хэрэгтэй.";
  }

  return { headline: "Маргаашид анхаарах гол зүйл", body };
}

// -----------------------------------------------------------------------------
// Internal rubric helpers
// -----------------------------------------------------------------------------

function pickDominantConcept(
  wrongConcepts: ConceptTag[],
  wellbeingSignals: ConceptTag[],
): ConceptTag {
  // Emotional distress is surfaced first — a struggling student needs a human
  // check-in before any re-teaching.
  if (wellbeingSignals.includes("low_wellbeing")) return "low_wellbeing";

  if (wrongConcepts.length > 0) {
    // Most frequent wrong academic concept wins.
    const counts = new Map<ConceptTag, number>();
    for (const c of wrongConcepts) counts.set(c, (counts.get(c) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  }

  if (wellbeingSignals.includes("wants_connection")) return "wants_connection";

  // All correct but shaky → low confidence signal.
  return "low_confidence";
}

function buildReason(
  tag: ConceptTag,
  confidentlyWrong: boolean,
  correctButUnsure: number,
): string {
  switch (tag) {
    case "low_wellbeing":
      return "Хичээл «хэцүү / дарамттай» эсвэл «төөрсөн» гэж үнэлсэн.";
    case "wants_connection":
      return "Асуулт асуухад тухгүй байгаа эсвэл багштай ярилцмаар байгаагаа илэрхийлсэн.";
    case "low_confidence":
      return `Зөв хариулсан хэдий ч ${correctButUnsure} удаа итгэлээ багатай гэж тэмдэглэсэн.`;
    default:
      if (confidentlyWrong) {
        return "Буруу хариултдаа итгэлтэй байсан нь ойлголтын алдааг илтгэж байна.";
      }
      return `«${CONCEPT_LABEL[tag]}» сэдвээр алдаа гаргасан.`;
  }
}

function actionForConcept(tag: ConceptTag, name: string): string {
  switch (tag) {
    case "denominator_size_misconception":
      return `${name}-аар 1/3 ба 1/4-ийг ижил хэмжээтэй тойргоор зуруулж, будсан талбайг харьцуул.`;
    case "equivalent_fraction_confusion":
      return `${name}-аар 1/2, 2/4, 3/6-г бутархайн туузаар угсруулж, тэнцүү болохыг харуул.`;
    case "low_confidence":
      return `${name}-д цаашаа үргэлжлүүлэхээсээ өмнө богино аман шалгалт өг.`;
    case "word_problem_application":
      return `${name}-тай нэг үгэн бодлогыг зураг зуран хамт задал.`;
    case "missed_submission":
      return "Хичээлээс хоцорсон эсвэл хандах асуудал байгаа эсэхийг эхэлж шалга.";
    case "low_wellbeing":
      return `${name}-тай хичээлийн дараа 2 минут ганцаарчлан ярилцаж, юу нь хэцүү байгааг сонс.`;
    case "wants_connection":
      return `${name}-тай богино найрсаг яриа өрнүүлж, асуулт асуухад тухтай орчин бий болгож байгаагаа мэдэгд.`;
  }
}

function interpretationForConcept(tag: ConceptTag, name: string): string {
  switch (tag) {
    case "denominator_size_misconception":
      return `${name} хуваарийг бүхэл тоо мэт харьцуулж байж магадгүй. «Хуваарь том бол бутархай том» гэх нийтлэг алдаа.`;
    case "equivalent_fraction_confusion":
      return `${name} бутархайг ойлгож байгаа ч өргөтгөх/хураах үед утга хадгалагдахыг бүрэн холбоогүй байна.`;
    case "low_confidence":
      return `${name} зөв хариулж байгаа ч өөртөө итгэлгүй байна. Ойлголт бэхжих хэрэгтэй.`;
    case "word_problem_application":
      return `${name} тооцоолол хийж чадаж байгаа ч бодит нөхцөлд хэрэглэхэд бэрхшээлтэй байна.`;
    case "missed_submission":
      return `${name}-ийн хариулт байхгүй тул академик дүгнэлт хийх боломжгүй. Эхлээд хандалтыг шалга.`;
    case "low_wellbeing":
      return `${name} энэ долоо хоног хичээлээ дарамттай/ойлгомжгүй гэж мэдэрсэн байна. Энэ нь зөвхөн сурлагын бус, сэтгэл санааны дэмжлэг хэрэгтэйг илтгэж болзошгүй.`;
    case "wants_connection":
      return `${name} багшаасаа асуулт асуухад тухгүй байна. Багш-сурагчийн итгэлцэл, холбоог бэхжүүлэх боломж энд бий.`;
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
