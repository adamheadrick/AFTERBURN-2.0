"use server";

import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function signInWithOtp(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/overview");
  }

  const email = String(formData.get("email") ?? "");
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`
    }
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Check your email for a sign-in link.");
}

export async function signOut() {
  if (!hasSupabaseConfig()) {
    redirect("/overview");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
