import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";

export default function SettingsPage() {
  return (
    <div>
      <PageTitle
        eyebrow="Configuration"
        title="Settings"
        description="Environment and integration readiness for Supabase, OpenAI, storage, and future geospatial views."
      />
      <Panel>
        <PanelHeader title="Integration Checklist" />
        <div className="grid gap-5 p-5 md:grid-cols-2">
          <Field label="NEXT_PUBLIC_SUPABASE_URL"><input className={inputStyles} placeholder="https://your-project.supabase.co" /></Field>
          <Field label="NEXT_PUBLIC_SUPABASE_ANON_KEY"><input className={inputStyles} placeholder="Supabase anon key" /></Field>
          <Field label="OPENAI_API_KEY"><input className={inputStyles} placeholder="sk-..." /></Field>
          <Field label="Mapbox / Map Integration"><input className={inputStyles} placeholder="Future MAPBOX_TOKEN" /></Field>
        </div>
        <div className="border-t border-line p-5 text-sm leading-6 text-steel">
          The MVP runs in preview mode until Supabase and OpenAI credentials are added in `.env.local`. Server-side API routes
          use `OPENAI_API_KEY` when available and return instructional scaffolds when generation is not connected.
        </div>
      </Panel>
    </div>
  );
}
