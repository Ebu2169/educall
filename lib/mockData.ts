// Realistic mock data for the EducAll prototype.
// Mongolian names, a single demo class (Grade 10A — Math), the weekly
// fraction diagnostic, and the analyzed student risk profiles the teacher sees.
//
// In production these shapes would come from the platform DB; the analyzed
// risk profiles below would be produced by `lib/copilot.ts` running over raw
// student responses. We precompute the canonical 4 hero students here so the
// demo is deterministic and pitch-ready.

import type {
  ClassRoom,
  DiagnosticQuestion,
  MisconceptionBucket,
  RosterStudent,
  School,
  StudentRisk,
} from "./types";

export const CLASS_CODE = "UB-BZD-TOM-10A";

export const school: School = {
  id: "tom",
  city: "Улаанбаатар хот",
  district: "Баянзүрх дүүрэг",
  name: "Тэмүжин Альтернатив Сургууль",
};

export const classRoom: ClassRoom = {
  id: "10a-math",
  schoolId: "tom",
  grade: "10А анги",
  subject: "Математик",
  classCode: CLASS_CODE,
  totalStudents: 49,
  submittedThisWeek: 38,
  strugglingCount: 18,
  needAttentionCount: 4,
  weeklyActive: true,
  topic: "Бутархай — Харьцуулах ба тэнцүү бутархай",
};

// ---------------------------------------------------------------------------
// Weekly diagnostic (this is what students answer)
// ---------------------------------------------------------------------------

// The weekly diagnostic blends academic checks with short wellbeing /
// connection questions. The goal is not only to find concept gaps but also to
// strengthen the teacher–student relationship in overcrowded classrooms.
export const weeklyDiagnostic: DiagnosticQuestion[] = [
  {
    id: "q1",
    kind: "academic",
    prompt: "1/3 ба 1/4 — аль нь том вэ?",
    concept: "denominator_size_misconception",
    options: [
      { id: "q1a", label: "1/3", correct: true },
      { id: "q1b", label: "1/4", correct: false },
      { id: "q1c", label: "Тэнцүү", correct: false },
      { id: "q1d", label: "Мэдэхгүй", correct: false },
    ],
  },
  {
    id: "q2",
    kind: "academic",
    prompt: "1/2-тэй тэнцүү бутархай аль нь вэ?",
    concept: "equivalent_fraction_confusion",
    options: [
      { id: "q2a", label: "2/4", correct: true },
      { id: "q2b", label: "1/4", correct: false },
      { id: "q2c", label: "2/3", correct: false },
      { id: "q2d", label: "1/3", correct: false },
    ],
  },
  {
    id: "q3",
    kind: "academic",
    prompt:
      "Бялууг 4 тэнцүү хэсэгт хуваав. Та 1 хэсгийг идэв. Хэдэн хэсгийг нь идсэн бэ?",
    concept: "word_problem_application",
    options: [
      { id: "q3a", label: "1/4", correct: true },
      { id: "q3b", label: "1/3", correct: false },
      { id: "q3c", label: "3/4", correct: false },
      { id: "q3d", label: "4/1", correct: false },
    ],
  },
  {
    id: "q4",
    kind: "wellbeing",
    prompt: "Энэ долоо хоног математикийн хичээл чамд ямар санагдсан бэ?",
    concept: "low_wellbeing",
    options: [
      { id: "q4a", label: "Хялбар, ойлгомжтой байсан" },
      { id: "q4b", label: "Боломжийн" },
      { id: "q4c", label: "Хэцүү, дарамттай байсан", signal: "low_wellbeing" },
      { id: "q4d", label: "Огт ойлгохгүй, төөрсөн", signal: "low_wellbeing" },
    ],
  },
  {
    id: "q5",
    kind: "wellbeing",
    prompt: "Багшаасаа асуулт асуух, тусламж гуихад чамд хэр тухтай байдаг вэ?",
    concept: "wants_connection",
    options: [
      { id: "q5a", label: "Үргэлж тухтай байдаг" },
      { id: "q5b", label: "Заримдаа тухтай" },
      {
        id: "q5c",
        label: "Тухгүй, ихэвчлэн асуудаггүй",
        signal: "wants_connection",
      },
      {
        id: "q5d",
        label: "Багштайгаа нэг ярилцмаар байна",
        signal: "wants_connection",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Analyzed student risk profiles — the teacher-facing demo highlight
// ---------------------------------------------------------------------------

export const attentionStudents: StudentRisk[] = [
  {
    studentId: "s-saran",
    studentName: "Саран",
    riskLevel: "high",
    riskScore: 87,
    conceptTag: "denominator_size_misconception",
    conceptGap: "Өөр хуваарьтай бутархайг харьцуулах",
    reason:
      "3 асуултаас 2-т буруу хариулсан бөгөөд нэг буруу хариултдаа маш итгэлтэй байсан.",
    suggestedAction:
      "1/3 ба 1/4-ийг харьцуулахдаа дүрс (бутархайн загвар) ашиглан тайлбарла.",
    evidence: [
      { text: "1/4 нь 1/3-аас том гэж буруу хариулсан." },
      { text: "Энэ хариултдаа итгэлээ «Маш итгэлтэй» гэж тэмдэглэсэн." },
      { text: "Тэнцүү бутархайн асуултад мөн алдсан." },
    ],
    interpretation:
      "Саран хуваарийг бүхэл тоо мэт харьцуулж байж магадгүй. Энэ нь «хуваарь том бол бутархай том» гэж эндүүрдэг нийтлэг ойлголтын алдаа юм.",
  },
  {
    studentId: "s-baterdene",
    studentName: "Бат-Эрдэнэ",
    riskLevel: "high",
    riskScore: 79,
    conceptTag: "equivalent_fraction_confusion",
    conceptGap: "Тэнцүү бутархай",
    reason:
      "Үндсэн дүрслэлийн асуултад зөв хариулсан ч тэнцүү бутархайн асуултад алдсан.",
    suggestedAction:
      "1/2, 2/4, 3/6-г бутархайн туузаар угсруулж, тэнцүү болохыг харуул.",
    evidence: [
      { text: "Бутархайн үндсэн дүрслэлийг зөв ойлгож байна." },
      { text: "1/2-тэй тэнцүү бутархайг буруу сонгосон." },
      { text: "Цаг хугацааны хувьд хурдан хариулсан — таамаглаж байж болзошгүй." },
    ],
    interpretation:
      "Бат-Эрдэнэ бутархайг ойлгож байгаа ч өргөтгөх/хураах үед утга нь хадгалагдана гэдгийг бүрэн холбоогүй байна.",
  },
  {
    studentId: "s-anu",
    studentName: "Ану",
    riskLevel: "medium",
    riskScore: 54,
    conceptTag: "low_confidence",
    conceptGap: "Итгэл бага / таамаглаж байна",
    reason:
      "2 асуултад зөв хариулсан хэдий ч тус бүрт итгэлээ багатай гэж тэмдэглэсэн.",
    suggestedAction:
      "Цаашаа үргэлжлүүлэхээсээ өмнө богино аман шалгалтаар ойлголтыг нь батлуул.",
    evidence: [
      { text: "2 асуултад зөв хариулсан." },
      { text: "Зөв хариултууддаа «Эргэлзэж байна» гэж тэмдэглэсэн." },
      { text: "Хариултын хэв маяг тогтворгүй байна." },
    ],
    interpretation:
      "Ану зөв хариулж байгаа ч өөртөө итгэлгүй байна. Энэ нь ойлголт бэхжээгүйг илтгэх дохио бөгөөд хайхрахгүй бол хожим эрсдэл болж хувирдаг.",
  },
  {
    studentId: "s-temuulen",
    studentName: "Тэмүүлэн",
    riskLevel: "medium",
    riskScore: 48,
    conceptTag: "missed_submission",
    conceptGap: "Нотолгоо дутуу",
    reason: "Энэ долоо хоногийн оношлогоог илгээгээгүй.",
    suggestedAction:
      "Хичээлээс хоцорсон эсвэл системд хандах асуудал байгаа эсэхийг эхэлж шалга.",
    evidence: [
      { text: "Энэ долоо хоног ямар ч хариулт илгээгээгүй." },
      { text: "Өмнөх 2 долоо хоногт идэвхтэй оролцож байсан." },
    ],
    interpretation:
      "Хариулт байхгүй учир академик дүгнэлт хийх боломжгүй. Эхлээд хандалт/ирцийн асуудлыг шалгах нь зүйтэй — энэ нь сурлагын бэрхшээл биш байж болно.",
  },
];

// A few extra "lower priority" students so the table feels real if expanded.
export const watchlistStudents: StudentRisk[] = [
  {
    studentId: "s-nomin",
    studentName: "Номин",
    riskLevel: "medium",
    riskScore: 45,
    conceptTag: "equivalent_fraction_confusion",
    conceptGap: "Тэнцүү бутархай",
    reason: "Тэнцүү бутархайн асуултад эргэлзэж байсан.",
    suggestedAction: "Бутархайн туузаар богино давталт хий.",
    evidence: [{ text: "Тэнцүү бутархайд итгэл багатай байсан." }],
    interpretation:
      "Номинд тэнцүү бутархайн ойлголт сул байж болзошгүй, ажиглалт хэрэгтэй.",
  },
  {
    studentId: "s-bilguun",
    studentName: "Билгүүн",
    riskLevel: "low",
    riskScore: 22,
    conceptTag: "word_problem_application",
    conceptGap: "Үгэн бодлого",
    reason: "Бүх асуултад зөв, гэхдээ үгэн бодлогод бага зэрэг удсан.",
    suggestedAction: "Шаардлагагүй — тогтвортой ахиц харагдаж байна.",
    evidence: [{ text: "Бүх асуултад зөв хариулсан." }],
    interpretation: "Билгүүн сайн ойлгож байна. Тусгай арга хэмжээ шаардлагагүй.",
  },
];

// ---------------------------------------------------------------------------
// Class-level misconception buckets (for the chart)
// ---------------------------------------------------------------------------

export const misconceptionBuckets: MisconceptionBucket[] = [
  { tag: "denominator_size_misconception", label: "Ялгаатай хуваарь харьцуулах", studentCount: 19 },
  { tag: "equivalent_fraction_confusion", label: "Тэнцүү бутархай", studentCount: 14 },
  { tag: "wants_connection", label: "Холбоо тогтоох хэрэгцээ", studentCount: 9 },
  { tag: "word_problem_application", label: "Үгэн бодлого", studentCount: 8 },
  { tag: "low_wellbeing", label: "Сэтгэл санааны дэмжлэг", studentCount: 7 },
  { tag: "missed_submission", label: "Илгээгээгүй", studentCount: 5 },
];

// Pool of Mongolian names used to build the full class roster.
export const rosterNames = [
  "Саран",
  "Бат-Эрдэнэ",
  "Ану",
  "Тэмүүлэн",
  "Номин",
  "Билгүүн",
  "Энхжин",
  "Марал",
  "Түгс",
  "Хулан",
  "Отгонбаяр",
  "Цэнгэл",
  "Долгион",
  "Ариунаа",
  "Болор",
  "Ганзориг",
  "Мөнхзул",
  "Тэгшбаяр",
  "Уянга",
  "Нямсүрэн",
  "Дэлгэрмаа",
  "Эрдэнэбат",
  "Сүхбаатар",
  "Алтанцэцэг",
  "Жавхлан",
  "Оюунаа",
  "Батбаяр",
  "Цолмон",
  "Хонгорзул",
  "Мөнх-Очир",
  "Нандин",
  "Гэрэлт",
  "Сэлэнгэ",
  "Тэмүжин",
  "Энхтуяа",
  "Баясгалан",
  "Цэрэндолгор",
  "Оргил",
  "Минж",
  "Ундрах",
];

// ---------------------------------------------------------------------------
// Full class roster (49 students) for the class-wide list/detail pages.
// Counts are calibrated to match the dashboard summary:
//   49 total · 38 submitted · 18 struggling · 4 need attention now
// ---------------------------------------------------------------------------

function buildRoster(): RosterStudent[] {
  const list: RosterStudent[] = [];

  // 1) The 4 "need attention now" students (mirror attentionStudents).
  for (const s of attentionStudents) {
    list.push({
      id: s.studentId,
      name: s.studentName,
      submitted: s.conceptTag !== "missed_submission",
      struggling: true,
      attention: true,
      riskLevel: s.riskLevel,
      note: s.conceptGap,
    });
  }

  const strugglingNotes = [
    "Тэнцүү бутархай",
    "Ялгаатай хуваарь харьцуулах",
    "Үгэн бодлого",
    "Итгэл бага / таамаглал",
    "Холбоо тогтоох хэрэгцээ",
    "Сэтгэл санааны дэмжлэг",
  ];

  let nameIdx = 4; // first 4 names already used by hero students

  const nextName = () => rosterNames[nameIdx++ % rosterNames.length];

  // 2) 14 additional "struggling" (submitted) students.
  for (let i = 0; i < 14; i++) {
    list.push({
      id: `r-struggle-${i}`,
      name: nextName(),
      submitted: true,
      struggling: true,
      attention: false,
      riskLevel: i % 3 === 0 ? "medium" : "low",
      note: strugglingNotes[i % strugglingNotes.length],
    });
  }

  // 3) 10 additional "not submitted" students (plus Тэмүүлэн = 11 total).
  for (let i = 0; i < 10; i++) {
    list.push({
      id: `r-missing-${i}`,
      name: nextName(),
      submitted: false,
      struggling: false,
      attention: false,
      note: "Энэ долоо хоног илгээгээгүй",
    });
  }

  // 4) Remaining students who are doing fine (submitted, no signals).
  const remaining = classRoom.totalStudents - list.length;
  for (let i = 0; i < remaining; i++) {
    list.push({
      id: `r-ok-${i}`,
      name: nextName(),
      submitted: true,
      struggling: false,
      attention: false,
      riskLevel: "low",
      note: "Тогтвортой ахиц",
    });
  }

  return list;
}

export const roster: RosterStudent[] = buildRoster();
