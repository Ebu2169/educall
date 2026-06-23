// Diagnostics endpoint — open in a browser (works on any deployment).
// Reports whether each integration's env vars are visible to the SERVER at
// runtime. Returns booleans only — never the secret values themselves.

import { supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export function GET() {
  const geminiKey = process.env.GEMINI_API_KEY;
  return Response.json({
    gemini: {
      keyPresent: Boolean(geminiKey && geminiKey.trim()),
      keyLength: geminiKey ? geminiKey.trim().length : 0,
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    },
    supabase: {
      configured: supabaseConfigured,
      urlPresent: Boolean(process.env.SUPABASE_URL),
      serviceKeyPresent: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
  });
}
