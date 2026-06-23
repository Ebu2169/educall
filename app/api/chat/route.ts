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

import { classRoom, weeklyDiagnostic } from "@/lib/mockData";
import { classroomChatReply } from "@/lib/chat";

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

interface ClientMessage {
  role: "assistant" | "user";
  text: string;
}

function buildSystemPrompt(studentName?: string): string {
  const questionList = weeklyDiagnostic
    .map((q, i) => `${i + 1}. (${q.kind}) ${q.prompt}`)
    .join("\n");

  return [
    'Чи бол "EducAll" сургалтын платформын сурагчдад зориулсан AI туслах.',
    studentName ? `Сурагчийн нэр: ${studentName}.` : "",
    `Анги: ${classRoom.grade}. Хичээл: ${classRoom.subject}. Энэ долоо хоногийн сэдэв: «${classRoom.topic}».`,
    "Энэ долоо хоногийн оношлогооны асуултууд:",
    questionList,
    "",
    "ҮҮРЭГ, ЗАН ТӨЛӨВ:",
    "- ХАМГИЙН ЧУХАЛ ДҮРЭМ: МОНГОЛ хэлээр маш ТОВЧ хариул. Дээд тал нь 3 өгүүлбэр. Хэзээ ч энэ хязгаараас хэтрүүлж, юм давтаж бичихгүй. Шууд гол санаагаа хэл.",
    "- Өнгө аяс: тайван, найрсаг, бодитой. Хэт халуун дотно, сэтгэл хөдлөлийн чимэглэлтэй үг (\"хайрт минь\", \"гайхалтай\", олон анхаарлын тэмдэг г.м.) бүү хэрэглэ. Энгийн, хүндэтгэлтэй бай.",
    "- Хичээлийн асуултад шууд хариул эсвэл 1–2 богино алхмаар тайлбарла. Сурагчийн оронд бүх ажлыг хийж бүү өг.",
    "- Сэтгэл санаа, стресс, найз нөхдийн талаар асуувал товч, шүүлтгүй сонсож, нэг л бодит зөвлөгөө өг. Мэдрэмжийг нь хэт магтаж, давтаж бүү тайлбарла.",
    "- Чи багш, эмч, оношлогч биш. Эмнэлгийн болон сэтгэл зүйн оношилгоо хийхгүй.",
    "- Ноцтой бэрхшээл (амиа хорлох бодол, өөрийгөө гэмтээх, хүчирхийлэл) илэрвэл итгэдэг том хүн — багш, эцэг эх рүүгээ хандахыг тайван санал болго.",
    "- Хичээл, сургууль, сэтгэл санаанд огт хамаагүй сэдвээс (гэрийн даалгаврыг бүтнээр бодож өгөх, улс төр г.м.) эелдгээр татгалз.",
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
          temperature: 0.5,
          maxOutputTokens: 400,
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
