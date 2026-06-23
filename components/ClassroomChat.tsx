"use client";

import * as React from "react";
import {
  chatGreeting,
  chatSuggestions,
  classroomChatReply,
  type ChatMessage,
} from "@/lib/chat";
import { useAppState } from "@/lib/store";
import { CloseIcon, RobotIcon, SendIcon, SparkleIcon } from "./icons";

export function ClassroomChat() {
  const { session } = useAppState();
  const studentName =
    session?.role === "student" ? session.name : undefined;

  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const seeded = React.useRef(false);
  const idCounter = React.useRef(0);
  const nextId = (prefix: string) => `${prefix}-${(idCounter.current += 1)}`;

  // Seed the greeting the first time the chat is opened (uses the student's
  // name once they're logged in).
  React.useEffect(() => {
    if (open && !seeded.current) {
      seeded.current = true;
      setMessages([
        { id: "greet", role: "assistant", text: chatGreeting(studentName) },
      ]);
    }
  }, [open, studentName]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    const userMsg: ChatMessage = {
      id: nextId("u"),
      role: "user",
      text: trimmed,
    };
    const history = [...messages, userMsg].map((m) => ({
      role: m.role,
      text: m.text,
    }));
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    // Ask the real LLM (Groq) via our API route. If anything goes wrong, fall
    // back to the deterministic rule-based engine so the chat never breaks.
    let reply: string;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, studentName }),
      });
      const data = await res.json();
      reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply
          : classroomChatReply(trimmed, { studentName });
    } catch {
      reply = classroomChatReply(trimmed, { studentName });
    }

    setMessages((m) => [
      ...m,
      { id: nextId("a"), role: "assistant", text: reply },
    ]);
    setTyping(false);
  }

  return (
    <>
      {/* Floating action button — sits above the bottom nav, bottom-right. */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Хичээлийн AI туслахыг нээх"
          className="animate-pop-in fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-3.5 text-white shadow-[var(--shadow-lift)] transition-all hover:bg-brand-700 active:scale-95"
        >
          <RobotIcon width={24} height={24} />
          <span className="text-sm font-semibold">AI туслах</span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="animate-pop-in fixed bottom-20 right-3 left-3 z-40 flex max-h-[70vh] flex-col overflow-hidden rounded-3xl border border-[var(--color-line)] bg-white shadow-[var(--shadow-lift)] sm:left-auto sm:w-[380px]">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-[var(--color-line)] bg-brand-600 px-4 py-3 text-white">
            <span className="grid size-9 place-items-center rounded-xl bg-white/15">
              <RobotIcon width={20} height={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">EducAll туслах</p>
              <p className="flex items-center gap-1 text-[11px] text-brand-100">
                <SparkleIcon width={11} height={11} />
                Хичээл + сэтгэл санааны туслах
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Хаах"
              className="grid size-8 place-items-center rounded-lg text-white/90 transition-colors hover:bg-white/15"
            >
              <CloseIcon width={18} height={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-bg)] px-3.5 py-4"
          >
            {messages.map((m) => (
              <Bubble key={m.id} role={m.role} text={m.text} />
            ))}
            {typing && <TypingBubble />}

            {/* Quick suggestions while the conversation is short */}
            {messages.length <= 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {chatSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 transition-colors hover:bg-brand-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-[var(--color-line)] bg-white px-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Бутархайн талаар асуу..."
              className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-base text-[var(--color-ink)] outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Илгээх"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white shadow-sm transition-all hover:bg-brand-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SendIcon width={20} height={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ role, text }: { role: "assistant" | "user"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-[var(--shadow-soft)] ${
          isUser
            ? "rounded-br-md bg-brand-600 text-white"
            : "rounded-bl-md border border-[var(--color-line)] bg-white text-[var(--color-ink)]"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[var(--color-line)] bg-white px-4 py-3 shadow-[var(--shadow-soft)]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-1.5 animate-bounce rounded-full bg-[var(--color-ink-muted)]"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
