import * as React from "react";
import Link from "next/link";
import { ArrowRightIcon } from "./icons";

type Tone = "brand" | "mint" | "amber" | "rose";

const toneStyles: Record<Tone, { icon: string; accent: string }> = {
  brand: { icon: "bg-brand-50 text-brand-600", accent: "text-brand-600" },
  mint: { icon: "bg-emerald-50 text-emerald-600", accent: "text-emerald-600" },
  amber: { icon: "bg-amber-50 text-amber-600", accent: "text-amber-600" },
  rose: { icon: "bg-rose-50 text-rose-600", accent: "text-rose-600" },
};

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
  urgent = false,
  href,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  urgent?: boolean;
  href?: string;
}) {
  const t = toneStyles[tone];

  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-ink-soft)]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
            {value}
          </p>
        </div>
        {icon && (
          <span
            className={`grid size-10 place-items-center rounded-xl ${t.icon} transition-transform duration-300 group-hover:scale-110`}
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        {hint ? (
          <p className={`text-xs font-medium ${t.accent}`}>{hint}</p>
        ) : (
          <span />
        )}
        {href && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${t.accent} opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100`}
          >
            Дэлгэрэнгүй
            <ArrowRightIcon width={13} height={13} />
          </span>
        )}
      </div>
    </>
  );

  const base = `group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] ${
    urgent ? "ring-1 ring-rose-200" : ""
  }`;

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={base}>{inner}</div>;
}
