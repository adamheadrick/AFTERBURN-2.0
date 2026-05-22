import { PageTitle } from "@/components/page-title";
import { DropoffReviewQueue } from "@/components/dropoff-review-queue";
import { getAppData } from "@/lib/data";

export default async function DropoffReviewPage() {
  const { dropoffSubmissions, dropoffScreeningReports, lessonsRepositoryItems } = await getAppData();

  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Admin"
        title="Dropoff Review Queue"
        description="Screen, review, sanitize, approve, reject, merge, and convert Dropoff submissions into repository records, AAR findings, improvement items, or future exercise inputs."
      />

      <section className="grid gap-3 rounded-md border border-line bg-panel p-4 md:grid-cols-4">
        {[
          ["General users", "Submit items and view their own screening status."],
          ["Entity leads", "Review submissions tied to their organization."],
          ["Exercise staff", "Review submissions tied to their exercise."],
          ["Admins", "Sanitize, approve, reject, merge, and publish repository records."]
        ].map(([title, detail]) => (
          <div key={title} className="rounded-md border border-line bg-night p-3">
            <p className="text-sm font-black text-flare">{title}</p>
            <p className="mt-2 text-sm font-semibold leading-5 text-ink">{detail}</p>
          </div>
        ))}
      </section>

      <DropoffReviewQueue
        demoSubmissions={dropoffSubmissions}
        demoReports={dropoffScreeningReports}
        demoRepositoryItems={lessonsRepositoryItems}
      />
    </div>
  );
}
