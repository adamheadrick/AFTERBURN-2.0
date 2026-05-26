import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand-mark";
import { ButtonLink } from "@/components/button";

const lifecycle = [
  ["Plan", "Build the exercise."],
  ["Execute", "Capture what happens."],
  ["Review", "Validate what matters."],
  ["Improve", "Assign and track fixes."],
  ["Library", "Preserve lessons."]
];

const learningChain = ["Objective", "Observation", "Finding", "Recommendation", "POA&M", "Lesson"];

const readinessFacts = [
  {
    label: "Disasters are more frequent and costly.",
    text: "NOAA counted 403 U.S. billion-dollar weather and climate disasters from 1980-2024; the most recent five-year average was 23 events per year.",
    href: "https://www.ncei.noaa.gov/access/billions/state-summary/US",
    source: "NOAA NCEI"
  },
  {
    label: "Coordination has to be rehearsed.",
    text: "The Lahaina fire analysis found that gaps in pre-event planning, unified command, and agency coordination contributed to insufficient communications during evacuation and firefighting operations.",
    href: "https://governor.hawaii.gov/newsroom/2024-40-hawai%CA%BBi-attorney-general-anne-lopez-announces-results-of-lahaina-fire-investigation-analysis-no-single-factor-but-complex-interaction-of-factors-led-to-maui-fire-devastation/",
    source: "Hawaii Attorney General"
  },
  {
    label: "Interoperability breaks under stress.",
    text: "The federal Katrina lessons learned report found that disconnected communications plans and architectures impeded coordination across federal, state, and local responders.",
    href: "https://georgewbush-whitehouse.archives.gov/reports/katrina-lessons-learned/chapter5.html/index.html",
    source: "White House Katrina report"
  },
  {
    label: "Exercises are where gaps become visible.",
    text: "FEMA frames exercises as the place to test plans, validate capabilities, and identify resource requirements, gaps, strengths, and areas for improvement.",
    href: "https://www.fema.gov/emergency-managers/national-preparedness/exercises",
    source: "FEMA"
  }
];

function InlineChain({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-steel">
      {items.map((item, index) => (
        <span key={item} className="flex items-center gap-3">
          <span className="font-semibold text-ink">{item}</span>
          {index < items.length - 1 ? <span className="h-px w-7 bg-line" /> : null}
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main id="home" className="min-h-screen bg-night text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-night/92 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center justify-between gap-5 px-5">
          <Link href="/" aria-label="AFTERBURN home" className="shrink-0">
            <BrandWordmark className="text-[1.22rem]" />
          </Link>
          <div className="hidden items-center gap-7 text-sm text-steel md:flex">
            <a href="#story" className="transition hover:text-ink">Product</a>
            <a href="#lifecycle" className="transition hover:text-ink">Lifecycle</a>
            <a href="#enter" className="transition hover:text-ink">Command Center</a>
          </div>
          <ButtonLink href="/overview" variant="subtle" className="!rounded-none px-2.5 py-1">
            Open Command Center
          </ButtonLink>
        </nav>
      </header>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:py-[4.5rem]">
          <BrandWordmark className="text-[clamp(1.55rem,3vw,2.7rem)]" />
          <div className="mt-8 max-w-3xl">
            <div className="mb-6 h-px w-36 bg-gradient-to-r from-flare via-ember to-transparent" />
            <h1 className="text-[clamp(1.75rem,3.4vw,2.65rem)] font-semibold leading-tight text-ink">
              Turn exercise chaos into accountable improvement.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-steel">
              Exercises are where teams discover whether the plan, people, communications, evidence, and follow-through
              will hold up under pressure. AFTERBURN keeps that readiness work connected.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2">
              <ButtonLink href="/overview" variant="flame" className="!rounded-none px-3 py-1.5">
                Open Command Center
                <ArrowRight size={14} />
              </ButtonLink>
              <a href="#lifecycle" className="text-sm font-semibold text-steel transition hover:text-ink">View Lifecycle</a>
            </div>
            <p className="mt-4 text-sm text-steel">Home explains the product. Command Center runs the active exercise.</p>
          </div>
        </div>
      </section>

      <section id="story" className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Prepared teams do not happen by accident.</h2>
          </div>
          <div className="grid gap-8">
            <p className="max-w-3xl text-base leading-7 text-steel">
              Real incidents keep proving the same point: readiness is a chain. Plans, roles, communications, field
              observations, leader decisions, evidence, findings, and corrective actions all have to survive contact
              with a fast-moving event.
            </p>
            <div className="grid gap-5 border-t border-line pt-5">
              {readinessFacts.map((fact) => (
                <article key={fact.label} className="grid gap-2 border-b border-line pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[0.55fr_1fr]">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{fact.label}</h3>
                    <a
                      href={fact.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block text-xs text-steel underline-offset-4 transition hover:text-ink hover:underline"
                    >
                      Source: {fact.source}
                    </a>
                  </div>
                  <p className="text-sm leading-6 text-steel">{fact.text}</p>
                </article>
              ))}
            </div>
            <div id="lifecycle" className="grid gap-3 border-t border-line pt-5">
              <h3 className="text-sm font-semibold text-ink">Plan → Execute → Review → Improve → Library</h3>
              <div className="grid gap-3 sm:grid-cols-5">
                {lifecycle.map(([phase, body]) => (
                  <div key={phase} className="border-t border-line pt-3">
                    <p className="text-sm font-semibold text-ink">{phase}</p>
                    <p className="mt-1 text-sm leading-5 text-steel">{body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-line pt-5">
              <h3 className="text-sm font-semibold text-ink">Traceability chain</h3>
              <div className="mt-3">
                <InlineChain items={learningChain} />
              </div>
            </div>
            <p className="border-t border-line pt-5 text-sm leading-6 text-steel">
              Built for military, emergency management, public safety, homeland defense, critical infrastructure, and
              interagency teams that need a calm way to turn activity into readiness.
            </p>
          </div>
        </div>
      </section>

      <section id="enter" className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-steel">
            Open Command Center to see the active exercise, top risk, next action, and priority issues.
          </p>
          <ButtonLink href="/overview" variant="subtle" className="!rounded-none px-3 py-1">
            Open Command Center
            <ArrowRight size={14} />
          </ButtonLink>
        </div>
      </section>

      <footer className="border-t border-[#d7ac55] bg-flare text-night">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-brand text-[0.96rem] font-black uppercase leading-none tracking-[0.14em] text-night">
              AFTERBURN
            </span>
            <p className="mt-3 text-sm text-night/75">Exercise lifecycle intelligence.</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold text-night/75" aria-label="Footer">
            <Link href="/" className="transition hover:text-night">Home</Link>
            <Link href="/overview" className="transition hover:text-night">Command Center</Link>
            <Link href="mailto:contact@afterburn.app" className="transition hover:text-night">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
