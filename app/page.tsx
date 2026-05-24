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

const useCases = [
  {
    title: "Exercise Planning",
    body: "Coordinate objectives, participants, injects, communications, and readiness."
  },
  {
    title: "After-Action Review",
    body: "Turn observations into findings, themes, AARs, and executive summaries."
  },
  {
    title: "Improvement Tracking",
    body: "Convert findings into POA&M items, owners, due dates, and reusable lessons."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-night text-ink">
      <MarketingHeader />

      <section id="product" className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16">
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
              <ButtonLink href="#demo" variant="ghost">See Demo Flow</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-panel/30">
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
          <h2 className="text-2xl font-semibold text-ink">Built for the exercise lifecycle.</h2>
          <p className="mt-3 text-sm leading-6 text-steel">
            Keep planning, observation capture, review, and corrective action connected without exposing every tool at once.
          </p>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {useCases.map((item) => (
            <article key={item.title} className="rounded-lg border border-line bg-panel p-4">
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-steel">{item.body}</p>
            </article>
          ))}
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
