import Link from "next/link";
import {
  AlertIcon,
  ArrowRightIcon,
  BookIcon,
  BrainIcon,
  GraduationIcon,
  LightbulbIcon,
  PulseIcon,
  ShieldIcon,
  SparkleIcon,
  TargetIcon,
  UsersIcon,
} from "@/components/icons";

const valueCards = [
  {
    icon: PulseIcon,
    title: "Долоо хоног тутмын богино оношлогоо",
    body: "Анги тус бүрт 5–7 богино асуулт. Сурагчид 3 минутад хариулна. Нэмэлт ачаалал бараг үгүй.",
    tone: "bg-brand-50 text-brand-600",
  },
  {
    icon: BrainIcon,
    title: "AI ойлголтын алдаа илрүүлэлт",
    body: "Зөвхөн оноо биш — яагаад алдаж байгааг ангилна. Жишээ нь «хуваарь том бол бутархай том» гэх эндүүрэл.",
    tone: "bg-violet-50 text-violet-600",
  },
  {
    icon: LightbulbIcon,
    title: "Багшийн үйлдлийн зөвлөмж",
    body: "Сурагч бүрт 5 минутад хийж болох тодорхой алхам. Юу хийхээ таамаглах хэрэггүй.",
    tone: "bg-amber-50 text-amber-600",
  },
];

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-600 text-white">
              <GraduationIcon width={20} height={20} />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">EducAll</p>
              <p className="text-[11px] font-medium text-[var(--color-ink-muted)]">
                Багшийн анхаарал чиглүүлэгч
              </p>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/diagnostic"
              className="hidden rounded-lg px-3.5 py-2 text-sm font-semibold text-[var(--color-ink-soft)] transition-colors hover:bg-slate-100 hover:text-[var(--color-ink)] sm:block"
            >
              Сурагчийн оношлогоо
            </Link>
            <Link
              href="/classes"
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 active:scale-[0.98]"
            >
              Багшийн самбар
              <ArrowRightIcon width={16} height={16} />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <SparkleIcon width={14} height={14} />
              AI эрт сэрэмжлүүлэх систем · Монголын ангиудад зориулав
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--color-ink)] sm:text-5xl">
              Шалгалт илрүүлэхээс өмнө,{" "}
              <span className="text-brand-600">далд бэрхшээлтэй сурагчдыг</span>{" "}
              олж тогтоо.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--color-ink-soft)]">
              EducAll нь хэт олон хүүхэдтэй ангид багш нарт{" "}
              <span className="font-semibold text-[var(--color-ink)]">
                энэ долоо хоногт хэн анхаарал шаардаж байгаа
              </span>
              , яагаад бэрхшээлтэй байгаа, дараа нь юу хийхийг тодорхойлоход
              тусална.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/classes"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-base font-semibold text-white shadow-[var(--shadow-soft)] transition-all hover:bg-brand-700 active:scale-[0.98]"
              >
                <UsersIcon width={20} height={20} />
                Багшийн самбар нээх
                <ArrowRightIcon
                  width={18}
                  height={18}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-[var(--color-ink)] shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
              >
                <BookIcon width={20} height={20} />
                Сурагчийн оношлогоо туршиж үзэх
              </Link>
            </div>

            <p className="mt-5 text-sm text-[var(--color-ink-muted)]">
              AI багшийг орлохгүй. Энэ бол{" "}
              <span className="font-semibold text-[var(--color-ink-soft)]">
                багшийн анхаарлыг чиглүүлэгч
              </span>{" "}
              — оношлох ба үнэлэх биш.
            </p>
          </div>

          {/* Funnel visual */}
          <ClassroomFunnel />
        </div>
      </section>

      {/* Problem strip */}
      <section className="mx-auto mt-6 max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-rose-50 p-5 sm:flex-row sm:items-center">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600">
            <AlertIcon width={22} height={22} />
          </span>
          <p className="text-sm leading-relaxed text-[var(--color-ink-soft)] sm:text-base">
            <span className="font-bold text-[var(--color-ink)]">
              Улаанбаатарын зарим ангид 70–80 сурагч сурдаг.
            </span>{" "}
            Багш нар санаа тавьдаг — гэхдээ анхаарал тэр бүгдэд хүрэхгүй. Чимээгүй
            сурагчид шалгалт хүртэл сар сараар хоцорч болдог. EducAll үүнийг эрт
            харагдуулна.
          </p>
        </div>
      </section>

      {/* Value cards */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-5 stagger sm:grid-cols-3">
          {valueCards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="group rounded-2xl border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] transition-all duration-200 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
              >
                <span
                  className={`grid size-12 place-items-center rounded-xl ${c.tone}`}
                >
                  <Icon width={24} height={24} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-[var(--color-ink)]">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {c.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <div className="overflow-hidden rounded-3xl border bg-white shadow-[var(--shadow-soft)]">
          <div className="grid gap-px bg-slate-100 md:grid-cols-3">
            <Step
              n={1}
              icon={<PulseIcon width={20} height={20} />}
              title="Долоо хоног бүр оношлогоо"
              body="Систем тухайн сэдвээр 5–7 богино асуулт үүсгэнэ. Сурагчид хариулна."
            />
            <Step
              n={2}
              icon={<BrainIcon width={20} height={20} />}
              title="AI хариултыг шинжилнэ"
              body="Зөв/буруу, итгэлийн түвшин, илгээлтийг нэгтгэн ойлголтын алдааг ангилна."
            />
            <Step
              n={3}
              icon={<TargetIcon width={20} height={20} />}
              title="Багшид жагсаалт өгнө"
              body="«Энэ долоо хоног хэнд анхаарал хэрэгтэй, яагаад, юу хийх вэ» гэдгийг харуулна."
            />
          </div>
        </div>

        {/* Positioning footer */}
        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 p-5 sm:flex-row sm:items-center">
          <ShieldIcon
            width={22}
            height={22}
            className="shrink-0 text-brand-600"
          />
          <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
            <span className="font-semibold text-brand-700">
              MVP нь дүрэмд тулгуурласан нээлттэй эхийн LLM ажиллагаа ашигладаг.
            </span>{" "}
            Багшийн санал хүсэлт нь ирээдүйн загвар сайжруулах (fine-tuning)
            өгөгдөл болно. Энэ нь AI багц биш, харин багшийн хэрэгсэл.
          </p>
        </div>
      </section>

      <footer className="border-t border-slate-200/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 text-sm text-[var(--color-ink-muted)] sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} EducAll · Багшийн анхаарал чиглүүлэгч</p>
          <p>Хакатоны прототип · Монгол хэл дээр</p>
        </div>
      </footer>
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
          {icon}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-ink-muted)]">
          Алхам {n}
        </span>
      </div>
      <h3 className="mt-3 text-base font-bold text-[var(--color-ink)]">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
        {body}
      </p>
    </div>
  );
}

// Visual: 70 students → 3 weekly questions → top 4 needing attention.
function ClassroomFunnel() {
  const highlighted = new Set([12, 27, 41, 58]);
  return (
    <div className="animate-fade-in rounded-3xl border border-[var(--color-line)] bg-white p-6 shadow-[var(--shadow-soft)] [animation-delay:120ms]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[var(--color-ink)]">
          Нэг ангийн долоо хоног
        </p>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
          Идэвхтэй
        </span>
      </div>

      {/* 70 students */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-ink-soft)]">
          <span>70 сурагч</span>
          <span className="inline-flex items-center gap-1 text-rose-500">
            <span className="size-2 rounded-full bg-rose-400" /> анхаарал хэрэгтэй
          </span>
        </div>
        <div className="mt-2 grid grid-cols-10 gap-1.5">
          {Array.from({ length: 70 }).map((_, i) => (
            <span
              key={i}
              className={`aspect-square rounded-[5px] transition-colors ${
                highlighted.has(i)
                  ? "bg-rose-500 animate-pulse-ring"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* arrow */}
      <div className="my-4 flex items-center justify-center gap-2 text-[var(--color-ink-muted)]">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
          <PulseIcon width={14} height={14} /> 3 долоо хоногийн асуулт
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      {/* top 4 */}
      <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
          Анхаарал шаардсан эхний 4 сурагч
        </p>
        <div className="mt-3 space-y-2">
          {[
            { n: "Саран", t: "Өндөр" },
            { n: "Бат-Эрдэнэ", t: "Өндөр" },
            { n: "Ану", t: "Дунд" },
            { n: "Тэмүүлэн", t: "Дунд" },
          ].map((s, i) => (
            <div
              key={s.n}
              className="flex items-center gap-2.5 rounded-xl bg-white px-3 py-2 shadow-sm"
            >
              <span className="grid size-6 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-[var(--color-ink)]">
                {s.n}
              </span>
              <span
                className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  s.t === "Өндөр"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {s.t} эрсдэл
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
