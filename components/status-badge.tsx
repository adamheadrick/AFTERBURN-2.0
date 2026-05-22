import type { ExerciseStatus, PoamStatus, Priority } from "@/lib/types/database";

const priorityStyles: Record<Priority, string> = {
  low: "border-line bg-field text-steel",
  medium: "border-line bg-field text-steel",
  high: "border-flare/40 bg-flare/10 text-flare",
  critical: "border-red-400/40 bg-red-500/15 text-red-200"
};

const statusStyles: Record<ExerciseStatus, string> = {
  draft: "border-line bg-field text-steel",
  scenario: "border-line bg-field text-steel",
  mission: "border-line bg-field text-steel",
  feedback: "border-line bg-field text-steel",
  analysis: "border-line bg-field text-steel",
  exsum: "border-flare/40 bg-flare/10 text-flare",
  complete: "border-signal/40 bg-signal/10 text-signal"
};

const poamStyles: Record<PoamStatus, string> = {
  not_started: "border-line bg-field text-steel",
  in_progress: "border-line bg-field text-steel",
  complete: "border-signal/40 bg-signal/10 text-signal",
  deferred: "border-red-400/40 bg-red-500/15 text-red-200"
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
}

export function ExerciseStatusBadge({ status }: { status: ExerciseStatus }) {
  return (
    <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${statusStyles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export function PoamStatusBadge({ status }: { status: PoamStatus }) {
  return (
    <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold capitalize ${poamStyles[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}
