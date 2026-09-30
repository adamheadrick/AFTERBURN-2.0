import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  MapPinned,
  RadioTower,
  Route,
  Search
} from "lucide-react";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand-mark";
import { ButtonLink } from "@/components/button";

const capabilityCards = [
  {
    title: "Plan",
    body: "Set objectives and roles. Start with what you already know.",
    icon: Route
  },
  {
    title: "Execute",
    body: "Capture observations, decisions, and evidence as events unfold.",
    icon: RadioTower
  },
  {
    title: "Review",
    body: "Find patterns. Validate findings against the evidence.",
    icon: FileCheck2
  },
  {
    title: "Improve",
    body: "Give every action an owner, a deadline, and a clear outcome.",
    icon: ClipboardCheck
  },
  {
    title: "Learn",
    body: "Carry lessons forward. Make the next plan stronger.",
    icon: BookOpen
  }
];

const audienceTags = [
  "Defense",
  "Emergency Management",
  "Public Safety",
  "Critical Infrastructure",
  "Multinational Organizations",
  "Complex Operational Environments"
];

const learningChain = ["Objective", "Observation", "Finding", "Recommendation", "Action", "Lesson"];

const outputs = [
  { title: "Commander Summary", note: "Leader-ready status and risk brief" },
  { title: "Exercise Placemat", note: "One-page operational snapshot" },
  { title: "AAR Draft", note: "Structured after-action narrative" },
  { title: "Executive Summary", note: "Concise senior-level synthesis" },
  { title: "Action Tracker", note: "Owners, dates, milestones, evidence" },
  { title: "Findings Matrix", note: "Validated issues tied to evidence" },
  { title: "Lessons Learned Library", note: "Reusable institutional knowledge" },
  { title: "Capability Gap Report", note: "Recurring risk and resourcing signals" }
];

const heroIssues = [
  ["High", "Communications plan ownership"],
  ["Medium", "Observer coverage by lane"],
  ["Medium", "UAS / airspace coordination"]
];

const topNavLinks = [
  { label: "Platform", href: "#product" },
  { label: "Lifecycle", href: "#lifecycle" },
  { label: "Proving Ground", href: "#proving-ground" },
  { label: "Contact", href: "#contact" }
];

const footerPlatformLinks = [
  { label: "Home", href: "/home" },
  { label: "Command Center", href: "/overview" },
  { label: "Lifecycle", href: "#lifecycle" },
  { label: "Library", href: "/library" }
];

const footerOutputLinks = [
  { label: "Commander Summary", href: "/exsum" },
  { label: "Exercise Placemat", href: "/overview" },
  { label: "After-Action Review", href: "/review" },
  { label: "Action Tracker", href: "/poam" }
];

const footerContactLinks = [
  { label: "Contact", href: "#contact" },
  { label: "Request Demo", href: "mailto:contact@afterburn.app?subject=AFTERBURN%20Demo%20Request" },
  { label: "Partner / Integration Inquiry", href: "mailto:contact@afterburn.app?subject=AFTERBURN%20Partner%20Inquiry" }
];

const faqs = [
  {
    question: "Is Home the same as Command Center?",
    answer: "No. Home explains the product. Command Center runs the active exercise and shows status, risk, issues, and next actions."
  },
  {
    question: "Is AFTERBURN primarily an AAR generator?",
    answer: "AFTERBURN connects objectives, observations, validated findings, recommendations, actions, and lessons. Reports are useful outputs; operational memory and accountable improvement are the purpose."
  },
  {
    question: "Who is AFTERBURN designed for?",
    answer: "Defense, emergency management, public safety, critical infrastructure, multinational organizations, and other teams operating in complex environments."
  }
];

function CommandCenterPreview() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-line bg-panel p-4 shadow-panel">

      <div className="relative grid gap-3">
        <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
          <div>
            <p className="text-sm font-semibold text-ink">COMMAND CENTER</p>
            <p className="mt-1 text-xs text-steel">Illustrative workspace · Review phase</p>
          </div>
          <span className="rounded-md border border-flare/25 bg-flare/10 px-2 py-1 text-xs font-semibold text-flare">Placemat</span>
        </div>

        <div className="grid gap-4 bg-night/80 p-4">
          <div className="border-b border-line pb-3">
            <p className="text-xs text-steel">Current status</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">Ready with friction</p>
          </div>
          <div className="pb-1">
            <p className="text-xs text-steel">Next action</p>
            <p className="mt-0.5 text-xs font-semibold text-ink">Assign comms lead</p>
          </div>
          <div className="overflow-hidden border-t border-line">
            <div className="border-b border-line px-3 py-2 text-xs font-semibold text-ink">Priority issues</div>
            {heroIssues.map(([severity, issue]) => (
              <div key={issue} className="grid grid-cols-[4.5rem_1fr] gap-2 border-b border-line px-3 py-2 text-xs last:border-b-0">
                <span className={severity === "High" ? "text-flare" : "text-steel"}>{severity}</span>
                <span className="text-ink">{issue}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2 text-xs text-steel sm:grid-cols-4">
          {["Plan complete", "Execute complete", "Review active", "Improve started"].map((item, index) => (
            <span key={item} className={`rounded-md border px-2 py-1 text-center ${index === 2 ? "border-flare/25 bg-flare/10 text-flare" : "border-line bg-night"}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main id="home" className="min-h-screen bg-night pt-[65px] text-ink">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-night/90 shadow-[0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-xl">
        <nav className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/home" aria-label="AFTERBURN home" className="rounded-md py-1 transition hover:text-ink">
            <BrandWordmark className="text-[1.08rem]" />
          </Link>
          <div className="hidden items-center gap-5 text-sm text-steel lg:flex">
            {topNavLinks.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-ink">{item.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <details className="relative lg:hidden">
              <summary className="list-none rounded-md border border-line bg-field px-3 py-1.5 text-xs font-semibold text-steel transition hover:text-ink [&::-webkit-details-marker]:hidden">
                Menu
              </summary>
              <div className="absolute right-0 top-10 z-50 grid min-w-40 gap-1 rounded-md border border-line bg-panel p-2 text-sm text-steel shadow-panel">
                {topNavLinks.map((item) => (
                  <a key={item.label} href={item.href} className="rounded px-3 py-2 transition hover:bg-field hover:text-ink">{item.label}</a>
                ))}
              </div>
            </details>
            <ButtonLink href="/overview" variant="subtle">
              <span className="hidden sm:inline">Open Command Center</span>
              <span className="sm:hidden">Open</span>
            </ButtonLink>
          </div>
        </nav>
      </header>

      <section className="relative scroll-mt-24 overflow-hidden border-b border-line">
        <div className="absolute inset-0 opacity-[0.16] [background-image:radial-gradient(circle_at_30%_20%,rgba(246,199,104,0.18),transparent_30%),linear-gradient(rgba(203,213,225,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(203,213,225,0.04)_1px,transparent_1px)] [background-size:auto,46px_46px,46px_46px]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1fr_0.86fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-flare">Operational learning & readiness</span>
            </div>
            <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,3.5vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
              The operational memory of high-readiness organizations.
            </h1>
            <p className="mt-5 max-w-[39rem] text-base leading-7 text-steel">
              Plan operations and exercises. Capture what actually happens. Turn observations into validated findings and accountable improvements. Carry what you learn into what comes next.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <ButtonLink href="/overview" variant="flame">
                Open Command Center
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="#lifecycle" variant="ghost">View Lifecycle</ButtonLink>
            </div>
          </div>
          <CommandCenterPreview />
        </div>
      </section>

      <section id="product" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-ink">Most organizations capture what happened. AFTERBURN remembers what it means.</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              An organization-agnostic operational learning and readiness platform that connects experience to improvement across events, teams, and time.
            </p>
          </div>
        </div>
        <p id="lifecycle" className="mt-8 scroll-mt-24 text-sm font-semibold text-flare">Plan → Execute → Review → Improve → Learn</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {capabilityCards.map((card) => (
            <article key={card.title} className="border-t border-line pb-2 pt-4">
              <h3 className="mt-3 text-sm font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 text-[0.82rem] leading-5 text-steel">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="use-cases" className="scroll-mt-24 border-y border-line bg-panel/35">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Built for complex operational environments.</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              Across organizations and countries, readiness depends on how people, authorities, decisions, and actions work together. AFTERBURN provides a common learning foundation while respecting each organization’s operating model.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {audienceTags.map((item) => (
              <span key={item} className="border-l border-line px-3 py-2 text-sm text-ink">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="learning-chain" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-ink">One connected record.</h2>
          <p className="mt-3 text-sm leading-6 text-steel">
            AFTERBURN keeps the learning chain intact — connecting what was planned, what happened, what was learned,
            who owns the fix, and what should be reused next time.
          </p>
        </div>
        <div className="mt-8 border-y border-line py-5">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            {learningChain.map((item, index) => (
              <div key={item} className="relative px-3 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-panel text-xs text-steel">{index + 1}</span>
                <p className="mt-3 text-sm font-semibold text-ink">{item}</p>
                {index < learningChain.length - 1 ? <div className="absolute left-[calc(100%-0.2rem)] top-6 hidden h-px w-4 bg-line lg:block" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="configuration" className="scroll-mt-24 border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-flare">A shared core. Your operating model.</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Your terminology. Your workflows.</h2>
          </div>
          <div className="space-y-4 text-sm leading-6 text-steel">
            <p>A common learning process, adapted to how your organization works. The configuration model covers terminology, organizational structures, review stages, and document templates across countries and doctrine.</p>
            <p>A defense team may use POA&amp;M. An emergency manager may use an improvement plan. Both connect the same evidence to accountable action.</p>
            <details className="border-t border-line pt-4"><summary className="cursor-pointer font-semibold text-ink">Configuration in the current demo</summary><p className="mt-3">Organization-specific configuration is part of the platform direction. The current demonstration uses example terminology and workflows.</p></details>
          </div>
        </div>
      </section>

      <section id="proving-ground" className="scroll-mt-24 border-y border-line bg-panel/35">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-flare">Upcoming operational validation</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Proving Ground — Lightning Strike 2.0</h2>
            <p className="mt-4 text-sm font-semibold text-ink">6–8 April 2027</p>
            <p className="mt-1 text-sm text-steel">Camp Gruber, Oklahoma</p>
          </div>
          <div className="space-y-4 text-sm leading-6 text-steel">
            <p>AFTERBURN will be used to assess Lightning Strike 2.0, a complex multi-agency exercise spanning civil disturbance response, wildfire operations, critical infrastructure, route clearance, CBRNE/SAR, and UAS/C-UAS integration.</p>
            <p className="text-lg font-semibold text-ink">Seams matter more than systems.</p>
            <p>The assessment will focus on handoffs and coordination across agencies and lanes—then connect those observations to validated findings and accountable improvements.</p>
            <p className="border-t border-line pt-4">One proving ground. A platform built for many organizations and countries. Validated lessons will follow the exercise.</p>
          </div>
        </div>
      </section>

      <section id="outputs" className="scroll-mt-24 border-y border-line bg-panel/35">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Useful outputs. Lasting memory.</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              AARs, executive summaries, and improvement plans are outputs of a connected learning process. The lasting value is the evidence, decisions, actions, and lessons that remain linked after a report is delivered.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {outputs.map((output) => (
              <div key={output.title} className="border-t border-line py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-flare" />
                  <p className="text-sm font-semibold text-ink">{output.title}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-steel">{output.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-14 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-ink">Make the next operation smarter than the last.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-steel">
            Preserve evidence, validate findings, assign accountable improvements, and carry organizational knowledge into future operations and exercises.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <ButtonLink href="/overview" variant="flame">
            <MapPinned size={15} />
            Open Command Center
          </ButtonLink>
          <ButtonLink href="/exercises/new" variant="subtle">
            <FileText size={15} />
            Start New Exercise
          </ButtonLink>
          <ButtonLink href="/library" variant="ghost">
            <Search size={15} />
            View Library
          </ButtonLink>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 border-y border-line bg-panel/35">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.7fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold text-ink">FAQ</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              Quick answers for leaders, planners, and partners evaluating operational learning and readiness.
            </p>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="border-b border-line py-4">
                <summary className="cursor-pointer text-sm font-semibold text-ink">{faq.question}</summary>
                <p className="mt-3 text-sm leading-6 text-steel">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="scroll-mt-24 border-t border-line bg-night">
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.62fr_0.75fr_0.8fr]">
          <div>
            <BrandWordmark className="text-[1.05rem]" />
            <p className="mt-3 max-w-sm text-sm leading-6 text-steel">
              The operational memory of high-readiness organizations.
            </p>
            <p className="mt-2 text-xs text-steel">Plan better. Capture reality. Drive improvement.</p>
          </div>

          <nav aria-label="Platform links">
            <h3 className="text-sm font-semibold text-ink">Platform</h3>
            <div className="mt-3 grid gap-2 text-sm text-steel">
              {footerPlatformLinks.map((item) => (
                <Link key={item.label} href={item.href} className="transition hover:text-ink">{item.label}</Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Resource links">
            <h3 className="text-sm font-semibold text-ink">Outputs</h3>
            <div className="mt-3 grid gap-2 text-sm text-steel">
              {footerOutputLinks.map((item) => (
                <Link key={item.label} href={item.href} className="transition hover:text-ink">{item.label}</Link>
              ))}
            </div>
          </nav>

          <nav aria-label="Contact links">
            <h3 className="text-sm font-semibold text-ink">Contact</h3>
            <div className="mt-3 grid gap-2 text-sm text-steel">
              {footerContactLinks.map((item) => (
                <Link key={item.label} href={item.href} className="transition hover:text-ink">{item.label}</Link>
              ))}
            </div>
          </nav>
        </div>

        <div className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-steel">
            <p>© 2026 AFTERBURN. All rights reserved.</p>
            <p>Operational learning across organizations, countries, and complex environments.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
