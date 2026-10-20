"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(3),
  date: z.string().min(1),
  location: z.string().min(2),
  lead_org: z.string().min(2),
  supporting_orgs: z.string().optional(),
  exercise_type: z.string().min(2),
  scenario_category: z.string().min(2)
});

export async function createExercise(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect(`/exercises/new?message=${encodeURIComponent("Add Supabase credentials in .env.local to create live exercises.")}`);
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(`/exercises/new?message=${encodeURIComponent("Complete the required exercise setup fields.")}`);
  }

  const { data, error } = await supabase
    .from("exercises")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      date: parsed.data.date,
      location: parsed.data.location,
      lead_org: parsed.data.lead_org,
      supporting_orgs: parsed.data.supporting_orgs?.split(",").map((item) => item.trim()).filter(Boolean) ?? [],
      exercise_type: parsed.data.exercise_type,
      scenario_category: parsed.data.scenario_category,
      status: "draft"
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(`/exercises/new?message=${encodeURIComponent(error?.message ?? "Exercise could not be created.")}`);
  }

  revalidatePath("/dashboard");
  redirect(`/exercises/${data.id}`);
}
