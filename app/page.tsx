import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand-mark";
import { ButtonLink } from "@/components/button";
import { MarketingHeader } from "@/components/marketing-header";

const phases = [
  { label: "Plan", body: "Build the exercise." },
  { label: "Execute", body: "Capture what happens." },
  { label: "Review", body: "Validate what matters." },
  { label: "Improve", body: "Assign and track fixes." },
  { label: "Library", body: "Preserve lessons." }
];

const environments = ["National Guard", "Emergency Management", "Law Enforcement", "Fire / Rescue", "Homeland Defense", "Critical Infrastructure", "Interagency Exercises", "UAS / Airspace", "ICS / NIMS", "COP Workflows"];

const actionChain = ["Objective", "Observation", "Finding", "Recommendation", "POA&M", "Lesson"];

const integrationTiles = [
  {
    title: "Exercise lifecycle intelligence",
    body: "Plan, execute, review, improve, and preserve lessons."
  },
  {
    title: "Doctrine-grounded IC support",
    body: "NIMS/ICS-aligned workflows, forms, and response support."
  },
  {
    title: "Evidence-to-action loop",
    body: "Turn observations into corrective action and reusable knowledge."
  }
];

const faqs = [
  {
    question: "Is Home the operational app?",
    answer: "No. Home orients visitors. Command Center runs the active exercise."
  },
  {
    question: "Does AFTERBURN replace AAR writing?",
    answer: "It connects planning, evidence, findings, summaries, corrective action, and lessons so AAR products are grounded in what happened."
  },
  {
    question: "Is TE/NIMS integrated today?",
    answer: "No completed integration is claimed here. The page shows a partner integration concept for future doctrine-grounded Incident Command support."
  }
];

function LifecycleVisual() {
  return (
    <div className="rounded-xl border border-line bg-panel/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {phases.map((phase, index) => (
          <span key={phase.label} className="flex items-center gap-2">
            <span className="rounded-md border border-line bg-night px-2.5 py-1.5 text-xs font-semibold text-ink">
              {phase.label}
            </span>
            {index < phases.length - 1 ? <span className="h-px w-5 bg-line" /> : null}
          </span>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-steel">
        Preserve the chain from objective to observation to finding to corrective action.
      </p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-night text-ink">
      <MarketingHeader />

      <section id="product" className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-[1fr_0.72fr] lg:items-center">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Plan, run, review, and improve complex exercises from one operational workspace.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-steel">
              AFTERBURN helps military, emergency management, law enforcement, and interagency teams turn exercise
              activity into findings, summaries, corrective actions, and reusable lessons.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <ButtonLink href="/command-center" variant="flame">
                Open Command Center
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="#lifecycle" variant="ghost">View Lifecycle</ButtonLink>
            </div>
            <p className="mt-3 text-xs text-steel">Home explains the product. Command Center runs the active exercise.</p>
          </div>
          <LifecycleVisual />
        </div>
      </section>

      <section id="lifecycle" className="border-b border-line bg-panel/30">
        <div className="mx-auto max-w-6xl px-5 py-8">
          <div className="grid gap-2 md:grid-cols-5">
            {phases.map((phase, index) => (
              <div key={phase.label} className="rounded-lg border border-line bg-night px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-ink">{phase.label}</h2>
                  <span className="text-xs text-steel">{index + 1}</span>
                </div>
                <p className="mt-2 text-sm text-steel">{phase.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="use-cases" className="mx-auto max-w-6xl px-5 py-12">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-ink">Built for complex response environments.</h2>
          <p className="mt-3 text-sm leading-6 text-steel">
            Designed for teams that need disciplined coordination without a cluttered portal.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {environments.map((item) => (
            <span key={item} className="rounded-md border border-line bg-panel px-3 py-1.5 text-xs font-semibold text-steel">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-panel/25">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-ink">From observation to action.</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              AFTERBURN keeps the learning chain intact from planned objective through reusable lesson.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {actionChain.map((item, index) => (
              <span key={item} className="flex items-center gap-2">
                <span className="rounded-md border border-line bg-night px-2.5 py-1.5 text-xs font-semibold text-ink">
                  {item}
                </span>
                {index < actionChain.length - 1 ? <span className="h-px w-4 bg-line" /> : null}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-semibold text-flare">Partner integration concept</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">AFTERBURN + TE/NIMS</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              AFTERBURN manages the exercise lifecycle. A TE/NIMS integration could connect validated exercise knowledge
              with doctrine-grounded Incident Command support, ICS/NIMS workflows, form generation, geospatial awareness,
              and edge-deployable decision support.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {integrationTiles.map((tile) => (
              <article key={tile.title} className="rounded-lg border border-line bg-panel p-4">
                <h3 className="text-sm font-semibold text-ink">{tile.title}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{tile.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="border-y border-line bg-panel/35">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Ready to work inside an exercise?</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-steel">
              Open Command Center to view the current exercise, phase status, priority issues, next actions, and lifecycle workspace.
            </p>
            <p className="mt-3 text-xs text-steel">Demo Mode: Lightning Strike sample exercise</p>
          </div>
          <ButtonLink href="/command-center" variant="flame">
            Open Command Center
            <ArrowRight size={16} />
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-2xl font-semibold text-ink">FAQ</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {faqs.map((item) => (
            <article key={item.question} className="rounded-lg border border-line bg-panel p-4">
              <h3 className="text-sm font-semibold text-ink">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-steel">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BrandWordmark className="text-[0.95rem]" />
            <p className="mt-3 text-sm text-steel">Exercise lifecycle intelligence for operational teams.</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-steel" aria-label="Footer">
            <Link href="/" className="transition hover:text-ink">Home</Link>
            <Link href="/command-center" className="transition hover:text-ink">Command Center</Link>
            <Link href="mailto:contact@afterburn.app" className="transition hover:text-ink">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
