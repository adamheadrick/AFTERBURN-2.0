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

const audiences = [
  "Military and National Guard",
  "Emergency management",
  "Public safety",
  "Homeland defense",
  "Critical infrastructure",
  "Interagency teams"
];

const faqs = [
  {
    question: "Is Home the operational workspace?",
    answer: "No. Home explains the product. Command Center runs the active exercise."
  },
  {
    question: "What does AFTERBURN connect?",
    answer: "Planning inputs, live observations, validated findings, EXSUM/AAR language, POA&M items, and preserved lessons."
  },
  {
    question: "Is TE/NIMS integrated today?",
    answer: "Not as a completed integration. The current concept shows how exercise evidence could connect to doctrine-grounded Incident Command support."
  }
];

function TextChain({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-steel">
      {items.map((item, index) => (
        <span key={item} className="flex items-center gap-3">
          <span className="font-semibold text-ink">{item}</span>
          {index < items.length - 1 ? <span className="h-px w-6 bg-line" /> : null}
        </span>
      ))}
    </div>
  );
}

export default function LandingPage() {
  return (
    <main id="home" className="min-h-screen bg-night text-ink">
      <header className="sticky top-0 z-50 border-b border-line bg-night/92 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-[4.25rem] max-w-6xl items-center justify-between gap-5 px-5">
          <Link href="/" aria-label="AFTERBURN home" className="shrink-0">
            <BrandWordmark className="text-[0.92rem]" />
          </Link>
          <div className="hidden items-center gap-6 text-sm text-steel md:flex">
            <a href="#story" className="transition hover:text-ink">Product</a>
            <a href="#lifecycle" className="transition hover:text-ink">Lifecycle</a>
            <a href="#integration" className="transition hover:text-ink">Integration</a>
            <a href="#faq" className="transition hover:text-ink">FAQ</a>
          </div>
          <ButtonLink href="/overview" variant="subtle" className="!rounded-none">
            Open Command Center
          </ButtonLink>
        </nav>
      </header>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <div className="mb-8 h-px w-40 bg-gradient-to-r from-flare via-ember to-transparent" />
          <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-ink sm:text-6xl">
                Turn exercise chaos into accountable improvement.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-steel">
                AFTERBURN helps military, emergency management, law enforcement, and interagency teams plan exercises,
                capture reality, generate EXSUM/AAR products, and track corrective action.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/overview" variant="flame" className="!rounded-none">
                  Open Command Center
                  <ArrowRight size={16} />
                </ButtonLink>
                <ButtonLink href="#lifecycle" variant="ghost" className="!rounded-none">View Lifecycle</ButtonLink>
              </div>
              <p className="mt-4 text-sm text-steel">Home explains the product. Command Center runs the active exercise.</p>
            </div>
            <div className="border-l border-line pl-6">
              <p className="text-sm leading-6 text-steel">
                Complex exercises scatter critical knowledge across planning documents, observer notes, hotwash comments,
                evidence folders, summaries, and corrective-action trackers. AFTERBURN keeps that chain intact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="story" className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.82fr_1.18fr]">
          <h2 className="text-2xl font-semibold text-ink">From fragmented exercise activity to one operational record.</h2>
          <p className="text-base leading-7 text-steel">
            AFTERBURN is not another dashboard layer. It is a lifecycle workspace for turning preparation, execution,
            review, and improvement into a connected record leaders can act on and teams can reuse.
          </p>
        </div>
      </section>

      <section id="lifecycle" className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <h2 className="text-2xl font-semibold text-ink">Plan → Execute → Review → Improve → Library</h2>
              <p className="mt-3 text-sm leading-6 text-steel">
                A simple surface for the full exercise lifecycle, with detail available only when the work requires it.
              </p>
            </div>
            <div className="grid gap-4">
              {lifecycle.map(([phase, body]) => (
                <div key={phase} className="grid gap-2 border-t border-line pt-4 sm:grid-cols-[8rem_1fr]">
                  <h3 className="text-sm font-semibold text-ink">{phase}</h3>
                  <p className="text-sm leading-6 text-steel">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Preserve the operational chain.</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              What was planned, what happened, what was learned, who owns the fix, and what should be reused next time.
            </p>
          </div>
          <TextChain items={learningChain} />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Built for teams that coordinate under pressure.</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              Serious enough for operational users, clean enough for a senior leader or partner to understand quickly.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {audiences.map((audience) => (
              <p key={audience} className="border-t border-line pt-3 text-sm font-semibold text-ink">
                {audience}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="integration" className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="text-sm font-semibold text-flare">Partner integration concept</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">AFTERBURN + TE/NIMS</h2>
          </div>
          <div className="grid gap-5">
            <p className="text-base leading-7 text-steel">
              AFTERBURN manages the exercise lifecycle: planning, execution capture, review, improvement tracking, and
              preservation of lessons learned. A TE/NIMS integration could connect validated exercise knowledge with
              doctrine-grounded Incident Command support, ICS/NIMS workflows, form generation, geospatial awareness, and
              edge-deployable decision support.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {["Exercise lifecycle intelligence", "Doctrine-grounded IC support", "Evidence-to-action loop"].map((item) => (
                <p key={item} className="border-t border-line pt-3 text-sm font-semibold text-ink">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.82fr_1.18fr]">
          <h2 className="text-2xl font-semibold text-ink">FAQ</h2>
          <div>
            {faqs.map((item) => (
              <details key={item.question} className="group border-t border-line py-4 last:border-b">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                </summary>
                <p className="mt-3 text-sm leading-6 text-steel">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Ready to work inside an exercise?</h2>
            <p className="mt-2 text-sm text-steel">Open Command Center to run the active exercise workspace.</p>
          </div>
          <ButtonLink href="/overview" variant="flame" className="!rounded-none">
            Open Command Center
            <ArrowRight size={16} />
          </ButtonLink>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <BrandWordmark className="text-[0.82rem]" />
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
