# EducAll — Багшийн анхаарал чиглүүлэгч

**EducAll** is an AI early-warning system for overcrowded Mongolian classrooms.
In Ulaanbaatar some teachers manage classes of 70–80 students, and quiet
students can fall behind for months before exams reveal it. EducAll is **not** an
AI tutor, grader, or teacher replacement — it is a **teacher attention router**.

Every week the system generates a few short diagnostic questions for a class
topic. Students answer them. The Copilot analyzes the responses and tells the
teacher: _"these students need your attention this week, here is why, and here is
what you can do in 5 minutes."_

The entire UI is in **Mongolian** for an authentic experience.

---

## Стек / Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- No database, no API keys — all state is local (React + `localStorage`)
- Simulated, rubric-guided LLM layer (`lib/copilot.ts`)

## Ажиллуулах / Getting started

```bash
pnpm install      # (dependencies are already installed in this workspace)
pnpm dev          # start the dev server → http://localhost:3000
```

Other scripts:

```bash
pnpm build        # production build
pnpm lint         # eslint
pnpm exec tsc --noEmit   # type-check
```

## Демо урсгал / Demo flow (≈60s pitch)

1. **Landing page** (`/`) — the overcrowded-classroom problem and the
   `70 сурагч → 3 асуулт → 4 сурагч` funnel visual.
2. Click **"Багшийн самбар нээх"** → **Classes** (`/classes`) — the hierarchy
   `Улаанбаатар → Баянзүрх → Тэмүжин Альтернатив Сургууль → 10А анги`.
3. Open the **10А анги — Математик** card → **Teacher dashboard** (`/dashboard`)
   with 72 students and the top 4 students needing attention.
4. Click **"AI үндэслэл харах"** on **Саран** → the AI reasoning modal (evidence,
   interpretation, 5-minute action, caution).
5. Click **"Зөв оношилсон"** → teacher feedback is saved as future
   fine-tuning data (UI updates).
6. Go to **Student diagnostic** (`/diagnostic`), enter a name + class code
   `UB-BZD-TOM-10A`, answer the 5 questions (3 academic + 2 wellbeing /
   connection), and submit.
7. Return to the dashboard → the Copilot **conceptually updates**: the new
   submission is analyzed live, counts increase, and a flagged student appears at
   the top marked **ШИНЭ**.

> The demo state persists in `localStorage`. Clearing site data resets it.

## Бүтэц / Project structure

```
app/
  page.tsx              # Landing
  classes/page.tsx      # Hierarchy / class selection
  dashboard/page.tsx    # Teacher dashboard (the core screen)
  diagnostic/page.tsx   # Student-facing diagnostic flow
components/
  AppShell, Sidebar, StatCard, RiskBadge, StudentRiskCard,
  CopilotInsightCard, MisconceptionChart, DiagnosticQuestionCard,
  ClassHierarchyCard, AIReasoningModal, icons
lib/
  types.ts       # domain types
  mockData.ts    # schools, class, students, questions, risk profiles
  copilot.ts     # simulated LLM (analyze, recommend, summarize)
  store.tsx      # demo state via useSyncExternalStore + localStorage
```

## AI давхарга / The "AI" layer

`lib/copilot.ts` is rule-based and deterministic so the prototype runs instantly
with **no keys and no network**. Its function signatures are designed as a
drop-in contract for a real model:

- `generateWeeklyDiagnostic(topic, grade)`
- `analyzeStudentResponses(studentResponses)`
- `generateTeacherRecommendation(student, evidence)`
- `generateClassSummary(classData)`

In production these bodies could call **Qwen via Ollama**, **Llama**, **Mistral**,
**Hugging Face Inference**, or a **LoRA fine-tune** trained on the teacher
feedback collected in the dashboard.

> **MVP нь дүрэмд тулгуурласан нээлттэй эхийн LLM ажиллагаа ашигладаг. Багшийн
> санал хүсэлт нь ирээдүйн загвар сайжруулах (fine-tuning) өгөгдөл болно.**

## Бүтээгдэхүүний байр суурь / Product positioning

EducAll is intentionally **not** a Google Classroom clone. Class structure,
curriculum, and communication are future platform context — the demo stays
focused on the one job that matters: **surfacing hidden struggling students in
overcrowded classrooms and giving teachers a prioritized weekly action list.**
Every signal is framed as an _early warning_, never a final judgment.
