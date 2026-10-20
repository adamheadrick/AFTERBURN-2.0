import { requireWorkspaceAccess } from "@/lib/access/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandWordmark } from "@/components/brand-mark";
import { ButtonLink } from "@/components/button";
import { workspaceSections } from "@/lib/workspace-navigation";

export default async function LandingPage() {
  await requireWorkspaceAccess();
  return <div className="min-h-screen bg-night text-ink">
    <header className="border-b border-line">
      <nav aria-label="Main" className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/" aria-label="AFTERBURN home"><BrandWordmark className="text-xl" /></Link>
        <ButtonLink href="/overview" variant="subtle">Open workspace<ArrowRight size={16} aria-hidden="true" /></ButtonLink>
      </nav>
    </header>
    <main className="mx-auto max-w-6xl px-5">
      <section className="border-b border-line py-16 sm:py-24">
        <p className="workspace-eyebrow">Exercise planning · Execution · Improvement</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Better exercises.<br />Clearer decisions.<br />Lasting improvement.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-steel">A workspace for military and civilian response planners. Start with what your team needs to practice, build the story together, and turn the results into action.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/exercises/new">Start planning<ArrowRight size={16} aria-hidden="true" /></ButtonLink>
          <ButtonLink href="/overview" variant="subtle">Explore the workspace</ButtonLink>
        </div>
        <p className="mt-4 text-sm text-steel">Development preview. Guided plans stay in your browser; other tools use separate workspace records.</p>
      </section>
      <section className="py-14" aria-labelledby="workflow-title">
        <h2 id="workflow-title" className="text-2xl font-semibold">One clear exercise lifecycle</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-steel">Start simply. Open the detailed tools when your exercise needs them.</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {workspaceSections.filter(section => ["plan", "execute", "review", "improve"].includes(section.id)).map((section, index) =>
            <Link key={section.id} href={section.href} className="workspace-tool">
              <p className="workspace-eyebrow">{"0" + (index + 1)}</p>
              <h3 className="mt-3 text-xl font-semibold">{section.label}</h3>
              <p className="mt-2 text-sm leading-7 text-steel">{section.description}</p>
            </Link>)}
        </div>
      </section>
      <section className="grid gap-7 border-t border-line py-14 md:grid-cols-2">
        <div><p className="workspace-eyebrow">Begin with what you know</p><h2 className="mt-3 text-2xl font-semibold">A few essentials. A useful first plan.</h2></div>
        <div className="space-y-4 text-sm leading-7 text-steel">
          <p>Describe the training need, setting, and participants. Shape the scenario, review proposed objectives and events, and develop a planning brief.</p>
          <p>Already have a brief? Import a PowerPoint, Word, or text document, review what AFTERBURN finds, and use it to inform your concept.</p>
          <ButtonLink href="/exercises/new" variant="subtle">Open guided planner</ButtonLink>
        </div>
      </section>
    </main>
    <footer className="border-t border-line"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-7 text-sm text-steel">
      <BrandWordmark className="text-sm" /><p>Plan. Execute. Review. Improve.</p><Link href="/library" className="underline underline-offset-4">Exercise library</Link>
    </div></footer>
  </div>;
}
