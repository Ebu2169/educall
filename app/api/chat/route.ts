// =============================================================================
// Classroom assistant API — real LLM (Google Gemini) with a rule-based fallback
// =============================================================================
//
// POST /api/chat  { messages: {role, text}[], studentName?: string }
//   -> { reply: string, source: "gemini" | "fallback" }
//
// The route builds a Mongolian, classroom-scoped system prompt from the SAME
// live data the diagnostic uses (this week's topic + the diagnostic questions),
// then calls Google's Gemini API. If the key is missing or the call fails for
// any reason, it transparently falls back to the deterministic rule-based
// engine in `lib/chat.ts`, so the chat can never hard-break.

import { classRoom } from "@/lib/mockData";
import { classroomChatReply } from "@/lib/chat";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

interface ClientMessage {
  role: "assistant" | "user";
  text: string;
}

function buildSystemPrompt(studentName?: string): string {
  return [
    'Чи бол "EducAll" платформын сурагчдад зориулсан ухаалаг AI туслах.',
    studentName ? `Сурагчийн нэр: ${studentName}.` : "",
    "",
    "ХАМГИЙН ЧУХАЛ:",
    "- Сурагчийн ТАВЬСАН асуултад ШУУД, ҮНЭН ЗӨВ, ойлгомжтой хариул. Юу асуусан, яг түүнд нь хариул.",
    "- Аль ч хичээл, сэдэв (математик, физик, хими, түүх, хэл, ерөнхий мэдлэг г.м.), даалгавар, тайлбар, санаа — бүгдэд нь тусал. Сэдвээр хязгаарлахгүй.",
    "- Асуултыг өөрийн дүрэм рүү бүү мушги. Тогтсон сэдэв (жишээ нь бутархай) эсвэл сэтгэл санааны яриа руу хүчээр бүү чиглүүл.",
    "",
    "ХЭВ МАЯГ:",
    "- МОНГОЛ хэлээр бич. Тодорхой, ойлгомжтой бай. Асуултад бүрэн хариул — гэхдээ шаардлагагүй ам бардам, давталт бүү нэм.",
    "- Найрсаг, энгийн, бодитой өнгөтэй. Хэт сэтгэл хөдлөлийн чимэглэл бүү хэрэгл.",
    "- Математик/томьёог ЭНГИЙН ТЕКСТЭЭР бич (жишээ: x^2, (x-2)(x-3)=0). LaTeX, $ тэмдэг, \\frac зэргийг бүү ашигла — энгийн чатад мууxан харагдана.",
    "- Хэрэв сурагч сэтгэл санаа, стрессээ өөрөө хуваалцвал товч, чин сэтгэлээсээ дэмж. Гэхдээ өөрөө бүү эхэл.",
    "- Ноцтой бэрхшээл (амиа хорлох бодол, хүчирхийлэл г.м.) илэрвэл итгэдэг том хүндээ хандахыг тайван санал болго.",
    `- Хэрэв хэрэгтэй бол: сурагч ${classRoom.grade}-д сурдаг, энэ долоо хоногийн математикийн сэдэв «${classRoom.topic}». Зөвхөн хамааралтай үед л дурд.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  let messages: ClientMessage[] = [];
  let studentName: string | undefined;

  try {
    const body = await request.json();
    if (Array.isArray(body?.messages)) messages = body.messages;
    if (typeof body?.studentName === "string") studentName = body.studentName;
  } catch {
    // malformed body — fall through to fallback with empty input
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastUserText = lastUser?.text ?? "";

  const apiKey = process.env.GEMINI_API_KEY;

  // No key configured → deterministic fallback.
  if (!apiKey) {
    return Response.json({
      reply: classroomChatReply(lastUserText, { studentName }),
      source: "fallback",
    });
  }

  try {
    // Keep the last ~10 turns for context; map to Gemini's content format.
    // Gemini uses roles "user" and "model" (not "assistant").
    const contents = messages.slice(-10).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildSystemPrompt(studentName) }],
        },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1200,
          // Gemini 2.5 "thinks" by default and spends output tokens on it,
          // which truncates short answers. Disable it for fast, concise replies.
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);

    const data = await res.json();
    const reply: string | undefined =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p?.text ?? "")
        .join("")
        .trim();

    if (!reply) throw new Error("Empty completion");

    return Response.json({ reply, source: "gemini" });
  } catch {
    // Network / key / provider error → never break the chat.
    return Response.json({
      reply: classroomChatReply(lastUserText, { studentName }),
      source: "fallback",
    });
  }
}
