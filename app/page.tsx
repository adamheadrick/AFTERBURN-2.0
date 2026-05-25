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
            <BrandWordmark className="text-[1.12rem]" />
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
        <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
          <BrandWordmark className="text-[clamp(2rem,5vw,4.5rem)]" />
          <div className="mt-12 max-w-4xl">
            <div className="mb-8 h-px w-44 bg-gradient-to-r from-flare via-ember to-transparent" />
            <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-6xl">
              Turn exercise chaos into accountable improvement.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-steel">
              AFTERBURN helps military, emergency management, law enforcement, and interagency teams plan exercises,
              capture reality, generate EXSUM/AAR products, and track corrective action.
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
            <h2 className="text-2xl font-semibold text-ink">Complex exercises scatter the truth.</h2>
          </div>
          <div className="grid gap-8">
            <p className="max-w-3xl text-base leading-7 text-steel">
              Planning inputs, observer notes, participant feedback, evidence, findings, summaries, and corrective
              actions often live in separate tools. AFTERBURN keeps that operational record connected so leaders can
              brief what happened, decide what matters, and track what changes next.
            </p>
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

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BrandWordmark className="text-[0.96rem]" />
            <p className="mt-3 text-sm text-steel">Exercise lifecycle intelligence.</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-steel" aria-label="Footer">
            <Link href="/" className="transition hover:text-ink">Home</Link>
            <Link href="/overview" className="transition hover:text-ink">Command Center</Link>
            <Link href="mailto:contact@afterburn.app" className="transition hover:text-ink">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
