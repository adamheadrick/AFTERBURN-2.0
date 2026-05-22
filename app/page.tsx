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
  Search,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand-mark";
import { ButtonLink } from "@/components/button";

const capabilityCards = [
  {
    title: "Plan",
    body: "Build objectives, scenarios, injects, participants, communications plans, and readiness gates.",
    icon: Route
  },
  {
    title: "Execute",
    body: "Capture observer input, live friction, lane activity, hotwash comments, and evidence.",
    icon: RadioTower
  },
  {
    title: "Review",
    body: "Turn observations into validated findings, themes, AAR content, and executive summaries.",
    icon: FileCheck2
  },
  {
    title: "Improve",
    body: "Convert findings into POA&M items, owners, due dates, milestones, and capability gaps.",
    icon: ClipboardCheck
  },
  {
    title: "Preserve",
    body: "Store lessons, templates, exercise archives, and reusable institutional knowledge.",
    icon: BookOpen
  }
];

const audienceTags = [
  "National Guard",
  "Emergency Management",
  "Law Enforcement",
  "Fire/Rescue",
  "Homeland Defense",
  "Critical Infrastructure",
  "Interagency Exercises",
  "UAS/Airspace Integration",
  "ICS",
  "Common Operating Picture Workflows"
];

const learningChain = ["Objective", "Observation", "Finding", "Recommendation", "POA&M", "Lesson"];

const outputs = [
  { title: "Commander Summary", note: "Leader-ready status and risk brief" },
  { title: "Exercise Placemat", note: "One-page operational snapshot" },
  { title: "AAR Draft", note: "Structured after-action narrative" },
  { title: "Executive Summary", note: "Concise senior-level synthesis" },
  { title: "POA&M Tracker", note: "Owners, dates, milestones, evidence" },
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
  { label: "Home", href: "#home" },
  { label: "Lifecycle", href: "#lifecycle" },
  { label: "Outputs", href: "#outputs" },
  { label: "FAQ", href: "#faq" },
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
  { label: "AAR Generator", href: "/review" },
  { label: "POA&M Tracker", href: "/poam" }
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
    question: "What does AFTERBURN generate?",
    answer: "It supports commander summaries, exercise placemats, AAR drafts, executive summaries, findings matrices, POA&M items, and lessons learned records."
  },
  {
    question: "Who is AFTERBURN designed for?",
    answer: "Military, emergency management, law enforcement, homeland defense, critical infrastructure, and interagency response organizations."
  }
];

function OperationalMapPanel() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-line bg-panel p-4 shadow-panel">
      <div className="absolute inset-0 opacity-[0.24] [background-image:linear-gradient(rgba(203,213,225,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(203,213,225,0.075)_1px,transparent_1px)] [background-size:26px_26px]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.16]" viewBox="0 0 520 420" aria-hidden="true">
        <path d="M-20 95 C75 42 148 142 238 82 S405 18 540 82" stroke="#cbd5e1" strokeWidth="1" fill="none" />
        <path d="M-34 164 C84 111 170 214 270 148 S430 92 548 154" stroke="#cbd5e1" strokeWidth="1" fill="none" />
        <path d="M-12 238 C112 178 182 288 304 218 S438 162 552 235" stroke="#cbd5e1" strokeWidth="1" fill="none" />
        <path d="M-20 316 C78 265 196 356 296 298 S432 244 538 308" stroke="#cbd5e1" strokeWidth="1" fill="none" />
      </svg>

      <div className="relative grid gap-3">
        <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
          <div>
            <p className="text-sm font-semibold text-ink">LIGHTNING STRIKE</p>
            <p className="mt-1 text-xs text-steel">Review Phase · 82% Ready with Friction</p>
          </div>
          <span className="rounded-md border border-flare/25 bg-flare/10 px-2 py-1 text-xs font-semibold text-flare">Placemat</span>
        </div>

        <div className="relative h-64 overflow-hidden rounded-md border border-line bg-night/80">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 420 230" aria-hidden="true">
            <path
              d="M92 50 260 49 302 84 286 115 324 141 292 178 160 170 140 151 105 160 78 128 98 108 82 86Z"
              fill="rgba(246,199,104,0.045)"
              stroke="rgba(246,199,104,0.5)"
              strokeWidth="1.5"
            />
            <path d="M110 137 C154 106 208 98 272 76" stroke="rgba(91,214,178,0.72)" strokeWidth="1.5" fill="none" strokeDasharray="4 5" />
            <path d="M144 78 C190 126 226 148 290 164" stroke="rgba(240,138,79,0.68)" strokeWidth="1.5" fill="none" />
            <path d="M84 130 C130 150 206 162 292 177" stroke="rgba(203,213,225,0.35)" strokeWidth="1" fill="none" />
            <circle cx="122" cy="139" r="5" fill="#f6c768" />
            <circle cx="272" cy="82" r="5" fill="#5bd6b2" />
            <circle cx="286" cy="164" r="5" fill="#f08a4f" />
            <circle cx="146" cy="79" r="4" fill="#cbd5e1" />
          </svg>
          <div className="absolute left-4 top-4 max-w-[12rem] rounded-md border border-line bg-panel/95 px-3 py-2">
            <p className="text-xs text-steel">Current status</p>
            <p className="mt-0.5 text-sm font-semibold text-ink">Ready with friction</p>
          </div>
          <div className="absolute right-4 top-4 rounded-md border border-line bg-panel/95 px-3 py-2">
            <p className="text-xs text-steel">Next action</p>
            <p className="mt-0.5 text-xs font-semibold text-ink">Assign comms lead</p>
          </div>
          <div className="absolute bottom-4 left-4 right-4 overflow-hidden rounded-md border border-line bg-panel/95">
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
              <span className="rounded-full border border-line bg-panel/70 px-2.5 py-1 text-xs text-steel">Demo mode · no external keys required</span>
              <span className="text-sm font-semibold text-flare">Exercise lifecycle intelligence</span>
            </div>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Exercise lifecycle intelligence for modern response operations.
            </h1>
            <p className="mt-5 max-w-[39rem] text-base leading-7 text-steel">
              AFTERBURN helps military, emergency management, law enforcement, and interagency teams plan exercises,
              capture observations, validate findings, generate summaries, and track improvements from one streamlined platform.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <ButtonLink href="/overview" variant="flame">
                Open Command Center
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="#lifecycle" variant="ghost">View Lifecycle</ButtonLink>
            </div>
          </div>
          <OperationalMapPanel />
        </div>
      </section>

      <section id="product" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-ink">What AFTERBURN does</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              A minimal surface for the full exercise lifecycle, with operational depth available when the team needs it.
            </p>
          </div>
          <Sparkles size={18} className="text-flare" />
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {capabilityCards.map((card) => (
            <article key={card.title} className="rounded-md border border-line bg-panel p-4 transition hover:-translate-y-0.5 hover:border-[#3a4658]">
              <card.icon size={18} className="text-flare" />
              <h3 className="mt-3 text-sm font-semibold text-ink">{card.title}</h3>
              <p className="mt-2 text-[0.82rem] leading-5 text-steel">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="use-cases" className="scroll-mt-24 border-y border-line bg-panel/35">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.72fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Built for complex response environments.</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              AFTERBURN is built for exercises where agencies, authorities, communications paths, evidence, and improvement actions all have to stay connected.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {audienceTags.map((item) => (
              <span key={item} className="rounded-md border border-line bg-night px-3 py-2 text-sm text-ink">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="lifecycle" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-ink">From observation to action.</h2>
          <p className="mt-3 text-sm leading-6 text-steel">
            AFTERBURN keeps the learning chain intact — connecting what was planned, what happened, what was learned,
            who owns the fix, and what should be reused next time.
          </p>
        </div>
        <div className="mt-8 rounded-lg border border-line bg-panel p-3">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
            {learningChain.map((item, index) => (
              <div key={item} className="relative rounded-md border border-line bg-night px-3 py-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-panel text-xs text-steel">{index + 1}</span>
                <p className="mt-3 text-sm font-semibold text-ink">{item}</p>
                {index < learningChain.length - 1 ? <div className="absolute left-[calc(100%-0.2rem)] top-6 hidden h-px w-4 bg-line lg:block" /> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="outputs" className="scroll-mt-24 border-y border-line bg-panel/35">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.7fr_1fr] lg:items-start">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Outputs that matter</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              The platform is organized around practical products planners can brief, edit, export, assign, and reuse.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {outputs.map((output) => (
              <div key={output.title} className="rounded-md border border-line bg-panel p-3">
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
          <h2 className="text-2xl font-semibold text-ink">Move from exercise activity to operational improvement.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-steel">
            Use AFTERBURN to preserve evidence, generate leader-ready outputs, assign corrective action, and carry knowledge forward into future exercises.
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
              Quick answers for leaders, planners, and partners evaluating how AFTERBURN fits the exercise lifecycle.
            </p>
          </div>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-md border border-line bg-panel p-4">
                <h3 className="text-sm font-semibold text-ink">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-steel">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="scroll-mt-24 border-t border-line bg-night">
        <div className="mx-auto grid max-w-6xl gap-7 px-5 py-8 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.62fr_0.75fr_0.8fr]">
          <div>
            <BrandWordmark className="text-[1.05rem]" />
            <p className="mt-3 max-w-sm text-sm leading-6 text-steel">
              Exercise lifecycle intelligence for modern response operations.
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
            <p>Built for military, emergency management, homeland defense, and interagency response organizations.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
