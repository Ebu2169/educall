"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "./BrandMark";
import { LayersIcon, SparkleIcon, UsersIcon } from "./icons";

const nav = [
  { href: "/classes", label: "Ангиуд", icon: LayersIcon },
  { href: "/dashboard", label: "Багшийн самбар", icon: UsersIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-line)] bg-white px-4 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <BrandMark size={36} />
        <div className="leading-tight">
          <p className="text-base font-bold tracking-tight text-[var(--color-ink)]">
            EducAll
          </p>
          <p className="text-[11px] font-medium text-[var(--color-ink-muted)]">
            Багшийн анхаарал чиглүүлэгч
          </p>
        </div>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-[var(--color-ink-soft)] hover:bg-slate-50 hover:text-[var(--color-ink)]"
              }`}
            >
              <Icon
                width={19}
                height={19}
                className={
                  active
                    ? "text-brand-600"
                    : "text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink-soft)]"
                }
              />
              {item.label}
              {active && (
                <span className="ml-auto size-1.5 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-brand-100 bg-brand-50 p-4">
        <div className="flex items-center gap-2 text-brand-700">
          <SparkleIcon width={16} height={16} />
          <p className="text-xs font-bold">MVP — Нээлттэй эх LLM</p>
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-ink-soft)]">
          Дүрэмд тулгуурласан нээлттэй эхийн LLM ажиллагаа. Багшийн санал хүсэлт
          нь ирээдүйн сургалтын өгөгдөл болно.
        </p>
      </div>
    </aside>
  );
}
