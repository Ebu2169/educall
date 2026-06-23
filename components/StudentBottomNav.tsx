// Decorative bottom navigation for the student app (Instagram-style).
// Icons only, no labels, and intentionally NON-interactive — it is purely a
// visual cue that the diagnostic lives inside a larger student app. The "Home"
// item is shown as the active tab.

import { ChatIcon, HomeIcon, HomeworkIcon } from "./icons";

export function StudentBottomNav() {
  return (
    <nav
      aria-hidden
      className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-line)] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
        <span className="grid size-11 place-items-center rounded-xl text-brand-600">
          <HomeIcon width={26} height={26} />
        </span>
        <span className="grid size-11 place-items-center rounded-xl text-[var(--color-ink-muted)]">
          <ChatIcon width={26} height={26} />
        </span>
        <span className="grid size-11 place-items-center rounded-xl text-[var(--color-ink-muted)]">
          <HomeworkIcon width={26} height={26} />
        </span>
      </div>
    </nav>
  );
}
