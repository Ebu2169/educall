import Link from "next/link";
import type { ClassRoom } from "@/lib/types";
import { ArrowRightIcon, BookIcon, UsersIcon } from "./icons";

export function ClassHierarchyCard({
  classRoom,
  liveSubmitted,
}: {
  classRoom: ClassRoom;
  liveSubmitted: number;
}) {
  return (
    <Link
      href="/dashboard"
      className="group block overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-brand-300 hover:shadow-[var(--shadow-lift)]"
    >
      {/* Accent header */}
      <div className="relative flex items-center justify-between gap-3 bg-brand-600 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-white/15">
            <BookIcon width={22} height={22} />
          </span>
          <div>
            <h3 className="text-lg font-bold">
              {classRoom.grade} — {classRoom.subject}
            </h3>
            <p className="text-xs text-brand-100">{classRoom.topic}</p>
          </div>
        </div>
        {classRoom.weeklyActive && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
            <span className="size-1.5 animate-pulse rounded-full bg-white" />
            Идэвхтэй
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
        <MiniStat
          value={classRoom.totalStudents}
          label="Нийт сурагч"
          tone="text-[var(--color-ink)]"
        />
        <MiniStat
          value={liveSubmitted}
          label="Илгээсэн"
          tone="text-brand-600"
        />
        <MiniStat
          value={classRoom.strugglingCount}
          label="Бэрхшээлтэй байж магадгүй"
          tone="text-amber-600"
        />
        <MiniStat
          value={classRoom.needAttentionCount}
          label="Яаралтай анхаарал"
          tone="text-rose-600"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3.5">
        <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-soft)]">
          <UsersIcon width={16} height={16} />
          Ангийн код: <span className="font-mono font-semibold">{classRoom.classCode}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-transform group-hover:translate-x-0.5">
          Самбар нээх
          <ArrowRightIcon width={16} height={16} />
        </span>
      </div>
    </Link>
  );
}

function MiniStat({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: string;
}) {
  return (
    <div className="bg-white px-4 py-4">
      <p className={`text-2xl font-bold tracking-tight ${tone}`}>{value}</p>
      <p className="mt-0.5 text-xs leading-tight text-[var(--color-ink-soft)]">
        {label}
      </p>
    </div>
  );
}
