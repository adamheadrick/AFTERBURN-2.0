import { ButtonLink, Button } from "@/components/button";
import { FeedbackExplorer } from "@/components/feedback-explorer";
import { PageTitle } from "@/components/page-title";
import { Field, inputStyles, Panel, PanelHeader } from "@/components/panel";
import { getAppData } from "@/lib/data";

export default async function FeedbackPage() {
  const { exercise, feedbackEntries } = await getAppData();
  const participatingOrganizations = Array.from(new Set([exercise.lead_org, ...exercise.supporting_orgs].filter(Boolean)));

  return (
    <div>
      <PageTitle
        eyebrow="Step 7"
        title="Observation and Feedback Collection"
        description="Collect evaluator and participant input so AFTERBURN can identify what worked, what did not, who was affected, and what should be fixed."
      />
      <div className="grid gap-6">
        <Panel>
          <PanelHeader title="Filter Submitted Feedback" eyebrow="Reporting and impacted functions" action={<ButtonLink href="/analysis" variant="ghost">Next: Analysis</ButtonLink>} />
          <div className="p-5">
            <FeedbackExplorer entries={feedbackEntries} />
          </div>
        </Panel>

        <Panel>
            <PanelHeader title="Evaluator / Observer Feedback" eyebrow="Structured evaluation form" />
            <form className="grid gap-5 p-5">
              <div className="grid gap-5 md:grid-cols-3">
                <Field label="Reporting Individual"><input className={inputStyles} /></Field>
                <Field label="Reporting Organization">
                  <select className={inputStyles} defaultValue="">
                    <option value="">Select organization</option>
                    {participatingOrganizations.map((organization) => <option key={organization}>{organization}</option>)}
                  </select>
                </Field>
                <Field label="Reporter Role / Function"><input className={inputStyles} /></Field>
                <Field label="Impacted Organization">
                  <select className={inputStyles} defaultValue="">
                    <option value="">Select organization</option>
                    {participatingOrganizations.map((organization) => <option key={organization}>{organization}</option>)}
                  </select>
                </Field>
                <Field label="Impacted Lane / Function"><input className={inputStyles} placeholder="Enter the lane, function, branch, or work area affected" /></Field>
                <Field label="Time Period"><input className={inputStyles} placeholder="Enter the time block or operational period" /></Field>
                <Field label="Related Objective"><input className={inputStyles} /></Field>
              </div>
              <Field label="What happened?"><textarea className={inputStyles} rows={4} /></Field>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="What worked well?"><textarea className={inputStyles} rows={4} /></Field>
                <Field label="What did not work?"><textarea className={inputStyles} rows={4} /></Field>
                <Field label="What caused friction?"><textarea className={inputStyles} rows={4} /></Field>
                <Field label="What capability gap was identified?"><textarea className={inputStyles} rows={4} /></Field>
                <Field label="What resource shortfall was observed?"><textarea className={inputStyles} rows={4} /></Field>
                <Field label="What communication issue occurred?"><textarea className={inputStyles} rows={4} /></Field>
                <Field label="What command/control issue occurred?"><textarea className={inputStyles} rows={4} /></Field>
                <Field label="What interagency coordination issue occurred?"><textarea className={inputStyles} rows={4} /></Field>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Recommended corrective action"><textarea className={inputStyles} rows={4} /></Field>
                <Field label="Likely responsible / supporting organization"><textarea className={inputStyles} rows={4} /></Field>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Priority">
                  <select className={inputStyles} defaultValue="">
                    <option value="">Select priority</option>
                    <option>low</option><option>medium</option><option>high</option><option>critical</option>
                  </select>
                </Field>
                <Field label="Sustain, Improve, or General Observation">
                  <select className={inputStyles} defaultValue="">
                    <option value="">Select observation type</option>
                    <option>sustain</option><option>improve</option><option>general</option>
                  </select>
                </Field>
              </div>
              <div><Button variant="ember" type="button">Submit Evaluator Feedback</Button></div>
            </form>
        </Panel>

        <Panel>
          <PanelHeader title="Participant Feedback" eyebrow="Simplified collection form" />
          <form className="grid gap-5 p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Reporting Individual / Organization"><input className={inputStyles} /></Field>
              <Field label="Role / Function"><input className={inputStyles} /></Field>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="What went well?"><textarea className={inputStyles} rows={4} /></Field>
              <Field label="What should be improved?"><textarea className={inputStyles} rows={4} /></Field>
              <Field label="Biggest friction point"><textarea className={inputStyles} rows={4} /></Field>
              <Field label="Most valuable lesson"><textarea className={inputStyles} rows={4} /></Field>
            </div>
            <Field label="Recommended change for next exercise"><textarea className={inputStyles} rows={4} /></Field>
            <div><Button variant="subtle" type="button">Submit Participant Feedback</Button></div>
          </form>
        </Panel>
      </div>
    </div>
  );
}
