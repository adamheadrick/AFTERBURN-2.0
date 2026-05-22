"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  exercise_id: z.string().uuid(),
  observer_name: z.string().min(2),
  organization: z.string().min(2),
  role: z.string().min(2),
  operational_lane: z.string().min(2),
  time_period: z.string().min(1),
  related_objective: z.string().optional(),
  what_happened: z.string().min(8),
  worked_well: z.string().optional(),
  did_not_work: z.string().optional(),
  friction: z.string().optional(),
  capability_gap: z.string().optional(),
  resource_shortfall: z.string().optional(),
  communication_issue: z.string().optional(),
  command_control_issue: z.string().optional(),
  interagency_issue: z.string().optional(),
  recommended_corrective_action: z.string().min(8),
  priority: z.enum(["low", "medium", "high", "critical"]),
  observation_type: z.enum(["sustain", "improve", "general"])
});

export async function createObservation(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect(`/observations/new?message=${encodeURIComponent("Add Supabase credentials in .env.local to submit live observations.")}`);
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
    redirect(`/observations/new?message=${encodeURIComponent("Complete each observation field before submitting.")}`);
  }

  const { error } = await supabase.from("feedback_entries").insert({
    ...parsed.data,
    related_objective: parsed.data.related_objective ?? "",
    worked_well: parsed.data.worked_well ?? "",
    did_not_work: parsed.data.did_not_work ?? "",
    friction: parsed.data.friction ?? "",
    capability_gap: parsed.data.capability_gap ?? "",
    resource_shortfall: parsed.data.resource_shortfall ?? "",
    communication_issue: parsed.data.communication_issue ?? "",
    command_control_issue: parsed.data.command_control_issue ?? "",
    interagency_issue: parsed.data.interagency_issue ?? ""
  });

  if (error) {
    redirect(`/observations/new?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/exercises/${parsed.data.exercise_id}`);
  redirect(`/feedback`);
}
