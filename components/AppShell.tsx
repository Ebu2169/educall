import * as React from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { BrandMark } from "./BrandMark";

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-[var(--color-line)] bg-white">
          <div className="flex items-center gap-3 px-5 py-3.5 sm:px-8">
            {/* Mobile brand */}
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <BrandMark size={32} />
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold tracking-tight text-[var(--color-ink)] sm:text-xl">
                {title}
              </h1>
              {subtitle && (
                <p className="truncate text-sm text-[var(--color-ink-soft)]">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
