import Link from "next/link";
import { ButtonLink } from "@/components/button";
import { PageTitle } from "@/components/page-title";
import { Panel, PanelHeader } from "@/components/panel";
import { ExerciseStatusBadge } from "@/components/status-badge";
import { getAppData } from "@/lib/data";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function ExercisesPage() {
  const { exercises } = await getAppData();

  return (
    <div>
      <PageTitle
        eyebrow="Exercise portfolio"
        title="Exercises"
        description="Review the exercise pipeline from draft scenario through tasking, feedback analysis, executive summary, and improvement plan closeout."
      />
      <Panel>
        <PanelHeader title="Exercise Register" action={<ButtonLink href="/exercises/new" variant="ember">Create Exercise</ButtonLink>} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-steel">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {exercises.map((exercise) => (
                <tr key={exercise.id} className="hover:bg-field">
                  <td className="px-5 py-4 font-bold text-ink"><Link href={`/exercises/${exercise.id}`}>{exercise.name}</Link></td>
                  <td className="px-5 py-4 text-steel">{formatDate(exercise.date)}</td>
                  <td className="px-5 py-4 text-steel">{exercise.exercise_type}</td>
                  <td className="px-5 py-4 text-steel">{exercise.scenario_category}</td>
                  <td className="px-5 py-4 text-steel">{exercise.lead_org}</td>
                  <td className="px-5 py-4"><ExerciseStatusBadge status={exercise.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
