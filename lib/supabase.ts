// =============================================================================
// Minimal Supabase REST helpers (no SDK dependency)
// =============================================================================
//
// We talk to Supabase's PostgREST endpoint directly with `fetch`, using the
// service-role key on the SERVER ONLY. This keeps the dependency surface tiny
// and works cleanly on Vercel serverless functions.
//
// Required env vars (set in .env.local locally and in Vercel project settings):
//   SUPABASE_URL                — e.g. https://xxxx.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   — Project Settings -> API -> service_role key
//
// If either is missing, `supabaseConfigured` is false and callers fall back to
// the local (localStorage) behaviour so the app never hard-breaks.

import type { DemoSubmission } from "./store";

const URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseConfigured = Boolean(URL && KEY);

const TABLE = "submissions";

function headers(extra?: Record<string, string>) {
  return {
    apikey: KEY as string,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

// DB columns are snake_case; the app uses camelCase.
interface Row {
  id: string;
  student_name: string;
  answers: DemoSubmission["answers"];
  correct_count: number;
  submitted_at: number;
}

function toSubmission(r: Row): DemoSubmission {
  return {
    id: r.id,
    studentName: r.student_name,
    answers: r.answers,
    correctCount: r.correct_count,
    submittedAt: r.submitted_at,
  };
}

export async function insertSubmission(sub: DemoSubmission): Promise<void> {
  if (!supabaseConfigured) throw new Error("Supabase not configured");
  const row: Row = {
    id: sub.id,
    student_name: sub.studentName,
    answers: sub.answers,
    correct_count: sub.correctCount,
    submitted_at: sub.submittedAt,
  };
  const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
    method: "POST",
    headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(`Supabase insert ${res.status}: ${await res.text()}`);
  }
}

export async function listSubmissions(): Promise<DemoSubmission[]> {
  if (!supabaseConfigured) throw new Error("Supabase not configured");
  const res = await fetch(
    `${URL}/rest/v1/${TABLE}?select=*&order=submitted_at.desc`,
    { headers: headers(), cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error(`Supabase list ${res.status}: ${await res.text()}`);
  }
  const rows = (await res.json()) as Row[];
  return rows.map(toSubmission);
}
