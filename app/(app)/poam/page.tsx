import { AiGenerator } from "@/components/ai-generator";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { PoamStatusBadge, PriorityBadge } from "@/components/status-badge";
import { getAppData } from "@/lib/data";

function poamToText(items: Awaited<ReturnType<typeof getAppData>>["poamItems"]) {
  return items
    .map(
      (item) => `${item.finding_id}: ${item.finding}
Corrective Action: ${item.corrective_action}
Responsible Office: ${item.responsible_office}
Supporting Agencies: ${item.supporting_agencies.join(", ")}
Priority: ${item.priority}
Due Date: ${new Date(item.due_date).toLocaleDateString()}
Status: ${item.status}
Measure of Success: ${item.measure_of_success}
Required Resources: ${item.required_resources ?? "TBD"}
Next Update: ${item.next_update_date ? new Date(item.next_update_date).toLocaleDateString() : "TBD"}
Escalation Flag: ${item.escalation_flag ? "Yes" : "No"}
Completion Evidence: ${item.completion_evidence ?? "Pending"}
Notes: ${item.notes}`
    )
    .join("\n\n");
}

export default async function PoamPage() {
  const { exercise, analysis, exsum, poamItems } = await getAppData();

  return (
    <div>
      <PageTitle
        eyebrow="Step 10"
        title="Improvement Plan / POA&M Tracker"
        description="Convert AAR findings and recommendations into accountable corrective actions with owners, supporting organizations, due dates, status, and measures of success."
      />
      <div className="grid gap-6">
        <Panel>
          <PanelHeader title="Corrective Action Register" eyebrow={exercise.name} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-steel">
                <tr>
                  <th className="px-5 py-3">Finding ID</th>
                  <th className="px-5 py-3">Finding / Gap</th>
                  <th className="px-5 py-3">Corrective Action</th>
                  <th className="px-5 py-3">Responsible Office</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Next Update</th>
                  <th className="px-5 py-3">Escalation</th>
                  <th className="px-5 py-3">Required Resources</th>
                  <th className="px-5 py-3">Completion Evidence</th>
                  <th className="px-5 py-3">Measure of Success</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {poamItems.map((item) => (
                  <tr key={item.id} className="align-top hover:bg-field">
                    <td className="px-5 py-4 font-black text-ink">{item.finding_id}</td>
                    <td className="px-5 py-4 text-steel">{item.finding}</td>
                    <td className="px-5 py-4 text-steel">{item.corrective_action}</td>
                    <td className="px-5 py-4 text-steel">{item.responsible_office}</td>
                    <td className="px-5 py-4"><PriorityBadge priority={item.priority} /></td>
                    <td className="px-5 py-4 text-steel">{new Date(item.due_date).toLocaleDateString()}</td>
                    <td className="px-5 py-4"><PoamStatusBadge status={item.status} /></td>
                    <td className="px-5 py-4 text-steel">{item.next_update_date ? new Date(item.next_update_date).toLocaleDateString() : "TBD"}</td>
                    <td className="px-5 py-4 text-steel">{item.escalation_flag ? "Yes" : "No"}</td>
                    <td className="px-5 py-4 text-steel">{item.required_resources ?? "TBD"}</td>
                    <td className="px-5 py-4 text-steel">{item.completion_evidence ?? "Pending"}</td>
                    <td className="px-5 py-4 text-steel">{item.measure_of_success}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="AI Improvement Plan Generation" eyebrow="From AAR findings" />
          <div className="p-5">
            <AiGenerator
              endpoint="/api/generate-poam"
              buttonLabel="Generate Improvement Items"
              payload={{ exercise, analysis, exsum }}
              initialOutput={poamToText(poamItems)}
              outputLabel="Improvement Plan / POA&M Items"
              large
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}
