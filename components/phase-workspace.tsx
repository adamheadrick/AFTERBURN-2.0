import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { workspaceSections, type WorkspaceId } from "@/lib/workspace-navigation";

export function PhaseWorkspace({ phase }: { phase: WorkspaceId }) {
  const section = workspaceSections.find(item => item.id === phase)!;
  return <div className="grid gap-6">
    <PageTitle eyebrow="Exercise workspace" title={section.label} description={section.description} />
    <section className="workspace-next">
      <div><p className="workspace-eyebrow">Start here</p>
        <h2 className="mt-2 text-lg font-semibold">{section.primary.label}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-steel">{section.primary.description}</p>
      </div>
      <ButtonLink href={section.primary.href}>{section.primary.label}<ArrowRight size={16} aria-hidden="true" /></ButtonLink>
    </section>
    <section aria-label={section.label + " tools"} className="grid gap-4 lg:grid-cols-3">
      {section.tools.map((tool, index) => <Link key={tool.href} href={tool.href} className="workspace-tool">
        <span className="workspace-eyebrow">{"0" + (index + 1)}</span>
        <h2 className="mt-4 text-lg font-semibold">{tool.label}</h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-steel">{tool.description}</p>
        <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-flare">Open<ArrowRight size={15} aria-hidden="true" /></span>
      </Link>)}
    </section>
    {section.more.length > 0 && <details className="workspace-details">
      <summary>More {section.label.toLowerCase()} tools <span className="text-steel">({section.more.length})</span></summary>
      <div className="grid gap-3 border-t border-line p-4 sm:grid-cols-2">
        {section.more.map(tool => <Link key={tool.href} href={tool.href} className="rounded-lg border border-line p-4 transition hover:bg-field">
          <h3 className="text-sm font-semibold">{tool.label}</h3>
          <p className="mt-1 text-sm leading-6 text-steel">{tool.description}</p>
        </Link>)}
      </div>
    </details>}
    <p className="border-t border-line pt-5 text-sm leading-6 text-steel"><strong className="font-semibold text-ink">What this phase produces: </strong>{section.outcome}</p>
  </div>;
}
