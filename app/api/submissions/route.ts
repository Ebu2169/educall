// =============================================================================
// Shared submissions API — Supabase-backed, with graceful no-op fallback
// =============================================================================
//
// POST /api/submissions  { id, studentName, answers, correctCount, submittedAt }
//   -> { ok: boolean, source: "supabase" | "local" }
// GET  /api/submissions
//   -> { submissions: DemoSubmission[], source: "supabase" | "local" }
//
// This is what lets a student submit on their PHONE and the teacher see it on
// their LAPTOP: both devices read/write the same Supabase table. If Supabase
// isn't configured (or errors), we degrade to local-only behaviour so the demo
// never breaks.

import type { DemoSubmission } from "@/lib/store";
import {
  insertSubmission,
  listSubmissions,
  supabaseConfigured,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!supabaseConfigured) {
    return Response.json({ submissions: [], source: "local" });
  }
  try {
    const submissions = await listSubmissions();
    return Response.json({ submissions, source: "supabase" });
  } catch {
    return Response.json({ submissions: [], source: "local" });
  }
}

export async function POST(request: Request) {
  let sub: DemoSubmission | null = null;
  try {
    const body = await request.json();
    if (
      body &&
      typeof body.id === "string" &&
      typeof body.studentName === "string" &&
      Array.isArray(body.answers)
    ) {
      sub = {
        id: body.id,
        studentName: body.studentName,
        answers: body.answers,
        correctCount: Number(body.correctCount) || 0,
        submittedAt: Number(body.submittedAt) || Date.now(),
      };
    }
  } catch {
    // malformed body
  }

  if (!sub) {
    return Response.json({ ok: false, source: "local" }, { status: 400 });
  }

  if (!supabaseConfigured) {
    return Response.json({ ok: false, source: "local" });
  }

  try {
    await insertSubmission(sub);
    return Response.json({ ok: true, source: "supabase" });
  } catch {
    return Response.json({ ok: false, source: "local" });
  }
}
