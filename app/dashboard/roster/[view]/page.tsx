import { notFound } from "next/navigation";
import { RosterView, type RosterViewId } from "@/components/RosterView";

const VIEWS: RosterViewId[] = ["all", "submitted", "struggling", "urgent"];

export function generateStaticParams() {
  return VIEWS.map((view) => ({ view }));
}

export default async function RosterPage({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;
  if (!VIEWS.includes(view as RosterViewId)) notFound();
  return <RosterView view={view as RosterViewId} />;
}
