import Link from "next/link";
import { ButtonLink } from "@/components/button";

type Tone = "ready" | "friction" | "risk" | "open";

type PhaseSection = {
  title: string;
  description: string;
  owner: string;
  status: string;
  evidence: string;
  href: string;
  action?: string;
  tone?: Tone;
};

type IssueRow = {
  severity: string;
  issue: string;
  owner: string;
  status: string;
  action: string;
  href: string;
  recommendation: string;
  tone?: Tone;
};

type Metric = {
  label: string;
  value: string | number;
  note: string;
};

type PhaseStep = {
  label: string;
  href: string;
  status?: string;
};

const toneStyles: Record<Tone, string> = {
  ready: "border-signal/35 bg-signal/10 text-signal",
  friction: "border-flare/35 bg-flare/10 text-flare",
  risk: "border-red-400/45 bg-red-500/10 text-red-100",
  open: "border-line bg-field text-steel"
};

export function PhaseHero({
  eyebrow,
  title,
  question,
  description,
  primaryHref,
  primaryAction,
  steps = []
}: {
  eyebrow: string;
  title: string;
  question: string;
  description: string;
  primaryHref: string;
  primaryAction: string;
  steps?: PhaseStep[];
}) {
  return (
    <section className="border-b border-line pb-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold text-steel">{eyebrow} · {title}</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-ink">{question}</h1>
          <p className="mt-1 max-w-2xl text-sm font-normal leading-6 text-steel">{description}</p>
        </div>
        <ButtonLink href={primaryHref} variant="subtle" className="min-h-8 px-3 py-1.5">{primaryAction}</ButtonLink>
      </div>
      {steps.length ? (
        <details className="mt-3 border-t border-line">
          <summary className="cursor-pointer px-3 py-2 text-sm font-normal text-steel transition hover:text-ink">
            Phase details
          </summary>
          <nav aria-label={`${eyebrow} sequence`} className="grid gap-1.5 border-t border-line p-2 text-xs font-normal text-steel sm:grid-cols-2 xl:grid-cols-3">
            {steps.map((step, index) => (
              <span key={step.label} className="min-w-0">
                <Link href={step.href} className="grid min-h-9 grid-cols-[auto_1fr_auto] items-center gap-2 border-t border-line px-2.5 py-1.5 text-steel transition hover:text-ink">
                  <span className="text-[0.72rem] text-steel">{index + 1}</span>
                  <span className="min-w-0 leading-4">{step.label}</span>
                  {step.status ? <span className="rounded border border-line bg-night px-1.5 py-0.5 text-[0.64rem] text-steel">{step.status}</span> : null}
                </Link>
              </span>
            ))}
          </nav>
        </details>
      ) : null}
    </section>
  );
}

export function GatePanel({
  label,
  status,
  statusTone = "friction",
  risk,
  nextAction,
  actionHref,
  actionLabel
}: {
  label: string;
  status: string;
  statusTone?: Tone;
  risk: string;
  nextAction: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <section className="grid gap-3 rounded-md border border-line bg-panel p-3 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-center">
      <div>
        <p className="text-xs font-semibold text-steel">{label}</p>
        <span className={`mt-1 inline-flex rounded-md border px-2 py-0.5 text-xs font-semibold ${toneStyles[statusTone]}`}>{status}</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-steel">Primary risk</p>
        <p className="mt-1 text-sm font-normal text-ink">{risk}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-steel">Next action</p>
        <p className="mt-1 text-sm font-normal text-ink">{nextAction}</p>
      </div>
      <ButtonLink href={actionHref} variant="flame" className="w-fit justify-self-start whitespace-nowrap">{actionLabel}</ButtonLink>
    </section>
  );
}

export function MetricStrip({ metrics }: { metrics: Metric[] }) {
  return (
    <details className="border-t border-line">
      <summary className="cursor-pointer py-2 text-sm font-normal text-steel transition hover:text-ink">Metrics</summary>
      <div className="grid gap-3 border-t border-line py-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="border-t border-line pt-2">
            <p className="text-xs font-semibold text-steel">{metric.label}</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p className="text-base font-semibold text-ink">{metric.value}</p>
              <p className="text-xs font-semibold text-steel">{metric.note}</p>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

export function PhaseSectionTable({
  title,
  description,
  sections
}: {
  title: string;
  description: string;
  sections: PhaseSection[];
}) {
  return (
    <details className="border-t border-line bg-transparent">
      <summary className="cursor-pointer px-4 py-3 transition hover:bg-field/50">
        <span className="block text-base font-semibold text-ink">{title}</span>
        <span className="mt-1 block text-sm font-normal text-steel">{description}</span>
      </summary>
      <div className="overflow-hidden border-t border-line">
        <div className="grid gap-2 border-b border-line bg-night px-2.5 py-1.5 text-[0.72rem] font-semibold text-steel max-lg:hidden lg:grid-cols-[1fr_8rem_9rem_1.05fr_9rem]">
          <span>Workstream</span>
          <span>Status</span>
          <span>Owner</span>
          <span>Evidence / requirement</span>
          <span className="text-right">Action</span>
        </div>
        {sections.map((section, index) => (
          <div key={section.title} className={`${index > 0 ? "border-t border-line" : ""} grid gap-2 px-2.5 py-2 transition hover:bg-field/70 lg:grid-cols-[1fr_8rem_9rem_1.05fr_9rem] lg:items-center`}>
            <div>
              <p className="text-sm font-semibold text-ink">{section.title}</p>
              <p className="mt-0.5 text-xs font-normal leading-5 text-steel">{section.description}</p>
            </div>
            <span className={`w-fit rounded-md border px-2 py-0.5 text-xs font-semibold ${toneStyles[section.tone ?? "open"]}`}>{section.status}</span>
            <p className="text-xs font-normal text-steel">{section.owner}</p>
            <p className="text-xs font-normal leading-5 text-steel">{section.evidence}</p>
            <ButtonLink href={section.href} variant="ghost" className="justify-self-start whitespace-nowrap lg:justify-self-end">{section.action ?? "Open"}</ButtonLink>
          </div>
        ))}
      </div>
    </details>
  );
}

export function IssueTable({
  title,
  description,
  issues
}: {
  title: string;
  description: string;
  issues: IssueRow[];
}) {
  const visibleIssues = issues.slice(0, 3);
  const hiddenIssues = issues.slice(3);

  return (
    <section className="border-t border-line bg-transparent">
      <div className="py-3">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        <p className="mt-1 text-sm font-normal text-steel">{description}</p>
      </div>
      <div className="overflow-hidden border-t border-line">
        <div className="grid gap-2 border-b border-line px-2.5 py-1.5 text-[0.72rem] font-semibold text-steel max-lg:hidden lg:grid-cols-[6rem_1fr_8rem_7rem_1.2fr_9rem]">
          <span>Severity</span>
          <span>Issue</span>
          <span>Owner</span>
          <span>Status</span>
          <span>Recommended action</span>
          <span className="text-right">Action</span>
        </div>
        {visibleIssues.map((issue, index) => (
          <div key={issue.issue} className={`${index > 0 ? "border-t border-line" : ""} grid gap-2 px-2.5 py-2 transition hover:bg-field/70 lg:grid-cols-[6rem_1fr_8rem_7rem_1.2fr_9rem] lg:items-center`}>
            <span className={`w-fit rounded-md border px-2 py-0.5 text-xs font-semibold ${toneStyles[issue.tone ?? "open"]}`}>{issue.severity}</span>
            <p className="text-sm font-semibold text-ink">{issue.issue}</p>
            <p className="text-xs font-normal text-steel">{issue.owner}</p>
            <p className="text-xs font-normal text-steel">{issue.status}</p>
            <p className="text-xs font-normal leading-5 text-steel">{issue.recommendation}</p>
            <ButtonLink href={issue.href} variant={issue.tone === "risk" ? "ember" : "subtle"} className="justify-self-start whitespace-nowrap lg:justify-self-end">{issue.action}</ButtonLink>
          </div>
        ))}
        {hiddenIssues.length ? (
          <details className="border-t border-line">
            <summary className="cursor-pointer px-2.5 py-2 text-sm text-steel transition hover:text-ink">
              View all issues ({hiddenIssues.length} more)
            </summary>
            {hiddenIssues.map((issue, index) => (
              <div key={issue.issue} className={`${index > 0 ? "border-t border-line" : ""} grid gap-2 px-2.5 py-2 transition hover:bg-field/70 lg:grid-cols-[6rem_1fr_8rem_7rem_1.2fr_9rem] lg:items-center`}>
                <span className={`w-fit rounded-md border px-2 py-0.5 text-xs font-semibold ${toneStyles[issue.tone ?? "open"]}`}>{issue.severity}</span>
                <p className="text-sm font-semibold text-ink">{issue.issue}</p>
                <p className="text-xs font-normal text-steel">{issue.owner}</p>
                <p className="text-xs font-normal text-steel">{issue.status}</p>
                <p className="text-xs font-normal leading-5 text-steel">{issue.recommendation}</p>
                <ButtonLink href={issue.href} variant={issue.tone === "risk" ? "ember" : "subtle"} className="justify-self-start whitespace-nowrap lg:justify-self-end">{issue.action}</ButtonLink>
              </div>
            ))}
          </details>
        ) : null}
      </div>
    </section>
  );
}

export function LifecycleChain({
  items
}: {
  items: Array<{ label: string; value: string | number; href: string }>;
}) {
  return (
    <details className="border-t border-line">
      <summary className="cursor-pointer py-2 text-sm font-normal text-steel transition hover:text-ink">
        Traceability Chain
      </summary>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <div>
          <p className="mt-0.5 text-xs font-semibold text-steel">Objective → Observation → Finding → Recommendation → POA&M → Lesson</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <Link href={item.href} className="border-t border-line px-2 py-1 text-xs font-semibold text-ink transition hover:text-flare">
              {item.label}: <span className="text-steel">{item.value}</span>
            </Link>
            {index < items.length - 1 ? <span className="text-line">→</span> : null}
          </span>
        ))}
      </div>
    </details>
  );
}
