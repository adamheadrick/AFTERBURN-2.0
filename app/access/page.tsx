import type { Metadata } from "next";
import { BrandWordmark } from "@/components/brand-mark";
import { Button } from "@/components/button";
import { inputStyles } from "@/components/panel";
import { accessPassword, safeReturnPath } from "@/lib/access/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Private access | AFTERBURN", robots: { index: false, follow: false } };

export default async function AccessPage({ searchParams }: { searchParams: Promise<{ error?: string; returnTo?: string }> }) {
  const params = await searchParams;
  const configured = !!accessPassword();
  return <main className="flex min-h-screen items-center justify-center bg-night px-5 py-12 text-ink">
    <section className="w-full max-w-md rounded-xl border border-line bg-panel p-7 sm:p-9">
      <BrandWordmark className="text-xl" />
      <p className="workspace-eyebrow mt-8">Private workspace</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome to AFTERBURN</h1>
      <p className="mt-4 text-sm leading-7 text-steel">{configured ? "Enter the shared password to open the workspace. No account is needed." : "Private access is being set up. Please contact the site owner for access."}</p>
      {configured && <form action="/api/access" method="post" className="mt-7 grid gap-4">
        <input type="hidden" name="returnTo" value={safeReturnPath(params.returnTo)} />
        <label htmlFor="workspace-password" className="grid gap-2 text-sm font-semibold">Workspace password
          <input id="workspace-password" name="password" type="password" required maxLength={256} autoComplete="current-password" className={inputStyles} aria-describedby={params.error === "incorrect" ? "access-error" : undefined} />
        </label>
        {params.error === "incorrect" && <p id="access-error" role="alert" className="text-sm text-red-200">That password didn’t match. Please try again.</p>}
        <Button type="submit">Open workspace</Button>
        <p className="text-xs leading-6 text-steel">Access lasts 12 hours. Use Lock workspace when you finish.</p>
      </form>}
    </section>
  </main>;
}
