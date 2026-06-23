"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import {
  ArrowRightIcon,
  BookIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/icons";
import { CLASS_CODE } from "@/lib/mockData";
import { useAppState, type Role } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppState();
  const [role, setRole] = React.useState<Role>("teacher");
  const [name, setName] = React.useState("");
  // `secret` holds the teacher password OR the student class code.
  const [secret, setSecret] = React.useState("");
  // Student password (asked in addition to name + class code).
  const [password, setPassword] = React.useState("");

  const isTeacher = role === "teacher";
  const canSubmit =
    name.trim().length > 0 &&
    (isTeacher
      ? secret.trim().length > 0
      : secret.trim().length > 0 && password.trim().length > 0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    login(role, name);
    router.push(isTeacher ? "/dashboard" : "/diagnostic");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-line)] bg-white">
        <div className="mx-auto flex max-w-md items-center justify-between px-5 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandMark size={36} />
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">EducAll</p>
              <p className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                Багшийн анхаарал чиглүүлэгч
              </p>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-8">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-3xl">
            Нэвтрэх
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-ink-soft)]">
            Та хэн болохоо сонгоод нэвтэрнэ үү.
          </p>

          {/* Role toggle */}
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--color-line)] bg-white p-1.5 shadow-[var(--shadow-soft)]">
            <RoleTab
              active={isTeacher}
              onClick={() => setRole("teacher")}
              icon={<UsersIcon width={18} height={18} />}
              label="Багш"
            />
            <RoleTab
              active={!isTeacher}
              onClick={() => setRole("student")}
              icon={<BookIcon width={18} height={18} />}
              label="Сурагч"
            />
          </div>

          <form
            onSubmit={submit}
            className="mt-4 space-y-4 rounded-2xl border bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6"
          >
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">
                Нэр
              </label>
              <div className="relative">
                <UsersIcon
                  width={18}
                  height={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isTeacher ? "Жишээ нь: Б. Оюун багш" : "Жишээ нь: Хулан"}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-base text-[var(--color-ink)] outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            {isTeacher ? (
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">
                  Нууц үг
                </label>
                <input
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-[var(--color-ink)] outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">
                    Ангийн код
                  </label>
                  <input
                    value={secret}
                    onChange={(e) => setSecret(e.target.value.toUpperCase())}
                    placeholder={CLASS_CODE}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-base text-[var(--color-ink)] outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                  <p className="mt-1.5 text-xs text-[var(--color-ink-muted)]">
                    Багшаас өгсөн код. Демо код:{" "}
                    <span className="font-mono font-semibold">{CLASS_CODE}</span>
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">
                    Нууц үг
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-[var(--color-ink)] outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isTeacher ? "Багшаар нэвтрэх" : "Сурагчаар нэвтрэх"}
              <ArrowRightIcon
                width={18}
                height={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </form>

          <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-brand-100 bg-brand-50/50 p-4">
            <ShieldIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand-600" />
            <p className="text-xs leading-relaxed text-[var(--color-ink-soft)]">
              Энэ бол демо нэвтрэлт — жинхэнэ нууц үг шалгахгүй. Багш нар компьютероор,
              сурагчид утаснаасаа нэвтэрч өөрсдийн хуудас руу шууд орно.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function RoleTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-brand-600 text-white shadow-sm"
          : "text-[var(--color-ink-soft)] hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
