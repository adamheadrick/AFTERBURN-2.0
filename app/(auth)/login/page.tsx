import { BrandWordmark } from "@/components/brand-mark";
import { ButtonLink } from "@/components/button";
import { signInWithOtp } from "@/lib/actions/auth";
import { Button } from "@/components/button";
import { hasSupabaseConfig } from "@/lib/config";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  const authEnabled = hasSupabaseConfig();

  return (
    <main className="flex min-h-screen items-center justify-center bg-night px-4 py-12 text-ink">
      <section className="surface-soft grid w-full max-w-5xl overflow-hidden rounded-md border border-line shadow-panel lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border-b border-line bg-[#090f1b] p-8 sm:p-10 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-3">
            <BrandWordmark className="text-sm" />
          </div>
          <h1 className="mt-16 max-w-xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Plan. Execute. Review. Improve.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-steel">
            Scenario design, partner tasking, rehearsal timelines, evaluator feedback, executive summaries, AARs, and improvement plans for operational teams.
          </p>
        </div>
        <div className="p-8 sm:p-10">
          <h2 className="text-2xl font-semibold text-ink">Sign in</h2>
          <p className="mt-2 text-sm text-steel">
            {authEnabled ? "Request an email link to sign in." : "Workspace accounts are not configured in this preview."}
          </p>
          {message ? (
            <div className="mt-5 rounded-md border border-flare/40 bg-flare/10 p-3 text-sm font-semibold text-ink">
              {message}
            </div>
          ) : null}
          {authEnabled ? (
            <form action={signInWithOtp} className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Work email
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="you@agency.gov"
                  className="h-11 rounded-md border border-line bg-night px-3 text-ink outline-none focus:border-flare focus:ring-2 focus:ring-flare/20"
                />
              </label>
              <Button variant="flame" type="submit">
                Send sign-in link
              </Button>
            </form>
          ) : (
            <div className="mt-8 grid gap-4">
              <ButtonLink href="/overview" variant="flame">
                Continue Preview
              </ButtonLink>
              <p className="text-sm leading-6 text-steel">
                The guided planner stores drafts in your browser. Export a copy to keep your work.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
