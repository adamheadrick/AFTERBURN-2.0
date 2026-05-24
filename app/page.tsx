import {
  ArrowRight,
  Archive,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  RadioTower,
  Route,
  Search,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand-mark";
import { ButtonLink } from "@/components/button";

const workflowSections = [
  {
    title: "Plan",
    body: "Build and validate the exercise.",
    action: "Purpose, objectives, scenario, partners, and readiness gate.",
    icon: Route
  },
  {
    title: "Execute",
    body: "Run the event and capture reality.",
    action: "Lane activity, injects, observations, friction, hotwash, and evidence.",
    icon: RadioTower
  },
  {
    title: "Review",
    body: "Validate findings and generate EXSUM/AAR outputs.",
    action: "Observations become findings, themes, summaries, and AAR language.",
    icon: FileCheck2
  },
  {
    title: "Improve",
    body: "Assign corrective action and track accountability.",
    action: "Recommendations become POA&M items, owners, due dates, and milestones.",
    icon: ClipboardCheck
  },
  {
    title: "Library",
    body: "Store lessons and reusable institutional knowledge.",
    action: "Reusable lessons, templates, prior outputs, findings, and capability gaps.",
    icon: Archive
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
  "ICS / NIMS",
  "Common Operating Picture Workflows"
];

const learningChain = ["Objective", "Observation", "Finding", "Recommendation", "POA&M", "Lesson"];

const outputs = [
  { title: "Commander Summary", note: "Leader-ready status and risk brief" },
  { title: "Status Brief / Placemat", note: "One-page exercise status product" },
  { title: "EXSUM/AAR Draft", note: "Validated narrative with themes and findings" },
  { title: "Findings Matrix", note: "Validated issues tied to evidence" },
  { title: "POA&M Tracker", note: "Owners, dates, milestones, evidence" },
  { title: "Lessons Library", note: "Reusable institutional knowledge" }
];

const heroIssues = [
  ["High", "Communications/COP ownership", "Assign comms lead"],
  ["Medium", "Observer coverage by lane", "Close coverage gap"],
  ["Medium", "UAS / airspace coordination", "Validate rehearsal check"]
];

const topNavLinks = [
  { label: "Home", href: "#home" },
  { label: "Lifecycle", href: "#lifecycle" },
  { label: "Outputs", href: "#outputs" },
  { label: "Integration", href: "#integration" },
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
  { label: "Status Brief", href: "/overview" },
  { label: "EXSUM / AAR Generator", href: "/review" },
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
    answer: "It supports commander summaries, one-page status briefs, EXSUM/AAR drafts, findings matrices, POA&M items, and lessons learned records."
  },
  {
    question: "Who is AFTERBURN designed for?",
    answer: "Military, emergency management, law enforcement, homeland defense, critical infrastructure, and interagency response organizations."
  }
];

const integrationTiles = [
  {
    title: "Exercise lifecycle intelligence",
    body: "Plan, execute, review, improve, and preserve lessons from complex interagency exercises."
  },
  {
    title: "Doctrine-grounded IC support",
    body: "A TE/NIMS concept could add NIMS/ICS-aligned decision support, forms, and response workflows."
  },
  {
    title: "Evidence-to-action loop",
    body: "Validated observations and findings become corrective action, training updates, and reusable operational knowledge."
  }
];

function ProductSurfacePanel() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-panel p-4 shadow-panel">
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(203,213,225,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(203,213,225,0.07)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-flare/10 blur-3xl" />

      <div className="relative grid gap-4">
        <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
          <div>
            <p className="text-xs text-steel">Exercise Status Board</p>
            <p className="mt-1 text-base font-semibold text-ink">LIGHTNING STRIKE</p>
            <p className="mt-1 text-xs text-steel">Review Phase · 82% Ready with friction</p>
          </div>
          <span className="rounded-md border border-flare/25 bg-flare/10 px-2 py-1 text-xs font-semibold text-flare">Active</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Readiness", "82%", "Ready with friction"],
            ["Biggest risk", "COP", "Ownership unclear"],
            ["Next action", "Comms", "Assign lead"]
          ].map(([label, value, note]) => (
            <div key={label} className="rounded-md border border-line bg-night/70 p-3">
              <p className="text-xs text-steel">{label}</p>
              <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
              <p className="mt-0.5 text-xs text-steel">{note}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-md border border-line bg-night/75">
          <div className="border-b border-line px-3 py-2 text-xs font-semibold text-ink">Priority issues</div>
          {heroIssues.map(([severity, issue, action]) => (
            <div key={issue} className="grid grid-cols-[4.5rem_1fr_auto] gap-2 border-b border-line px-3 py-2 text-xs last:border-b-0">
              <span className={severity === "High" ? "text-flare" : "text-steel"}>{severity}</span>
              <span className="text-ink">{issue}</span>
              <span className="hidden text-steel sm:inline">{action}</span>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-line bg-night/75 p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-ink">EXSUM/AAR progress</p>
            <p className="text-xs text-steel">Draft pending</p>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["Observations", "Findings", "Draft", "POA&M"].map((item, index) => (
              <div key={item} className="min-w-0">
                <div className={`h-1 rounded-full ${index < 2 ? "bg-flare" : "bg-field"}`} />
                <p className="mt-1 truncate text-[0.68rem] text-steel">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2 text-xs text-steel sm:grid-cols-4">
          {["Plan ready", "Execute complete", "Review active", "Improve started", "Library capturing"].map((item, index) => (
            <span key={item} className={`rounded-md border px-2 py-1 text-center ${index === 2 ? "border-flare/25 bg-flare/10 text-flare" : "border-line bg-night/80"}`}>
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
            <span className="inline-flex rounded-full border border-line bg-panel/70 px-2.5 py-1 text-xs text-steel">
              Exercise lifecycle intelligence
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Turn exercise chaos into accountable improvement.
            </h1>
            <p className="mt-5 max-w-[39rem] text-base leading-7 text-steel">
              AFTERBURN helps military, emergency management, public safety, and interagency teams plan exercises,
              capture reality, generate EXSUM/AAR products, and track corrective action from one clean workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <ButtonLink href="/overview" variant="flame">
                Open Command Center
                <ArrowRight size={16} />
              </ButtonLink>
              <ButtonLink href="#lifecycle" variant="ghost">View Lifecycle</ButtonLink>
            </div>
          </div>
          <ProductSurfacePanel />
        </div>
      </section>

      <section id="product" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold text-ink">How AFTERBURN works</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              Minimal surface, full depth underneath. Each phase moves the team from planning intent to validated improvement.
            </p>
          </div>
          <Sparkles size={18} className="text-flare" />
        </div>
        <div className="mt-8 grid gap-2 lg:grid-cols-5">
          {workflowSections.map((section, index) => (
            <article key={section.title} className="relative rounded-lg border border-line bg-panel p-4">
              {index < workflowSections.length - 1 ? <div className="absolute left-[calc(100%-0.25rem)] top-7 hidden h-px w-3 bg-line lg:block" /> : null}
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-night text-flare">
                  <section.icon size={16} />
                </div>
                <span className="text-xs text-steel">{index + 1}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-ink">{section.title}</h3>
              <p className="mt-2 text-sm leading-5 text-ink">{section.body}</p>
              <p className="mt-2 text-xs leading-5 text-steel">{section.action}</p>
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

      <section id="integration" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1fr] lg:items-start">
          <div>
            <span className="inline-flex rounded-full border border-line bg-panel/70 px-2.5 py-1 text-xs text-steel">
              Partner integration concept
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-ink">AFTERBURN + TE/NIMS</h2>
            <p className="mt-3 text-sm leading-6 text-steel">
              AFTERBURN manages the exercise lifecycle. A TE/NIMS integration concept could connect validated exercise
              knowledge to doctrine-grounded incident command support, ICS/NIMS workflows, forms, geospatial context, and
              reusable response playbooks.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {integrationTiles.map((tile) => (
              <article key={tile.title} className="rounded-md border border-line bg-panel p-4">
                <h3 className="text-sm font-semibold text-ink">{tile.title}</h3>
                <p className="mt-2 text-xs leading-5 text-steel">{tile.body}</p>
              </article>
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
            <CheckCircle2 size={15} />
            Open Command Center
          </ButtonLink>
          <ButtonLink href="/exercises/new" variant="subtle">
            <FileText size={15} />
            Start New Exercise
          </ButtonLink>
          <ButtonLink href="/library" variant="ghost">
            <Search size={15} />
            Open Library
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
            <p className="mt-3 max-w-sm text-sm leading-6 text-steel">Exercise lifecycle intelligence.</p>
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
