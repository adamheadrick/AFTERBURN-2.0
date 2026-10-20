import { cache } from "react";
import { hasSupabaseConfig } from "@/lib/config";
import { demoAfterburnData } from "@/lib/demo-data";
import { instructionalAfterburnData } from "@/lib/instructional-data";
import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = cache(async () => {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
});

export const getAppData = cache(async () => {
  if (!hasSupabaseConfig()) {
    return {
      ...demoAfterburnData,
      error: "Local demo mode: add Supabase and OpenAI credentials in .env.local to enable live auth, saved data, and AI generation."
    };
  }

  const supabase = await createClient();

  const [
    exercises,
    scenarios,
    missionAssignments,
    objectives,
    injects,
    feedbackEntries,
    syncMatrixEntries,
    readinessScores,
    evaluatorAssignments,
    decisionPoints,
    capabilityGaps,
    trendInsights,
    evidenceItems,
    aiAnalysis,
    exsums,
    poamItems,
    dropoffSubmissions,
    dropoffScreeningReports,
    lessonsRepositoryItems
  ] = await Promise.all([
    supabase.from("exercises").select("*").order("updated_at", { ascending: false }),
    supabase.from("scenarios").select("*").order("updated_at", { ascending: false }).limit(1),
    supabase.from("mission_assignments").select("*").order("updated_at", { ascending: false }).limit(1),
    supabase.from("objectives").select("*").order("created_at", { ascending: false }),
    supabase.from("injects").select("*").order("inject_time", { ascending: true }),
    supabase.from("feedback_entries").select("*").order("created_at", { ascending: false }),
    supabase.from("sync_matrix_entries").select("*").order("time_block", { ascending: true }),
    supabase.from("exercise_readiness_scores").select("*").order("updated_at", { ascending: false }).limit(1),
    supabase.from("evaluator_assignments").select("*").order("time_block", { ascending: true }),
    supabase.from("decision_points").select("*").order("time_window", { ascending: true }),
    supabase.from("capability_gaps").select("*").order("recurrence_count", { ascending: false }),
    supabase.from("trend_insights").select("*").order("created_at", { ascending: false }),
    supabase.from("evidence_items").select("*").order("created_at", { ascending: false }),
    supabase.from("ai_analysis").select("*").order("created_at", { ascending: false }).limit(1),
    supabase.from("exsums").select("*").order("updated_at", { ascending: false }).limit(1),
    supabase.from("poam_items").select("*").order("created_at", { ascending: false }),
    supabase.from("dropoff_submissions").select("*").order("submitted_at", { ascending: false }),
    supabase.from("dropoff_screening_reports").select("*").order("created_at", { ascending: false }),
    supabase.from("lessons_repository_items").select("*").order("updated_at", { ascending: false })
  ]);

  const exercise = exercises.data?.[0] ?? instructionalAfterburnData.exercise;

  return {
    exercises: exercises.data ?? [],
    exercise,
    scenario: scenarios.data?.[0] ?? instructionalAfterburnData.scenario,
    missionAssignment: missionAssignments.data?.[0] ?? instructionalAfterburnData.missionAssignment,
    objectives: objectives.data ?? [],
    injects: injects.data ?? [],
    feedbackEntries: feedbackEntries.data ?? [],
    syncMatrixEntries: syncMatrixEntries.data ?? [],
    readinessScore: readinessScores.data?.[0] ?? instructionalAfterburnData.readinessScore,
    evaluatorAssignments: evaluatorAssignments.data ?? [],
    decisionPoints: decisionPoints.data ?? [],
    capabilityGaps: capabilityGaps.data ?? [],
    trendInsights: trendInsights.data ?? [],
    evidenceItems: evidenceItems.data ?? [],
    analysis: aiAnalysis.data?.[0] ?? instructionalAfterburnData.analysis,
    exsum: exsums.data?.[0] ?? instructionalAfterburnData.exsum,
    poamItems: poamItems.data ?? [],
    dropoffSubmissions: dropoffSubmissions.data ?? instructionalAfterburnData.dropoffSubmissions,
    dropoffScreeningReports: dropoffScreeningReports.data ?? instructionalAfterburnData.dropoffScreeningReports,
    lessonsRepositoryItems: lessonsRepositoryItems.data ?? instructionalAfterburnData.lessonsRepositoryItems,
    error:
      exercises.error?.message ??
      scenarios.error?.message ??
      missionAssignments.error?.message ??
      objectives.error?.message ??
      injects.error?.message ??
      feedbackEntries.error?.message ??
      syncMatrixEntries.error?.message ??
      readinessScores.error?.message ??
      evaluatorAssignments.error?.message ??
      decisionPoints.error?.message ??
      capabilityGaps.error?.message ??
      trendInsights.error?.message ??
      evidenceItems.error?.message ??
      aiAnalysis.error?.message ??
      exsums.error?.message ??
      poamItems.error?.message ??
      dropoffSubmissions.error?.message ??
      dropoffScreeningReports.error?.message ??
      lessonsRepositoryItems.error?.message
  };
});

export const getDashboardData = getAppData;

export const getExercise = cache(async (id: string) => {
  const data = await getAppData();
  const exercise = data.exercises.find((item) => item.id === id) ?? null;

  return {
    ...data,
    exercise,
    objectives: data.objectives.filter((item) => item.exercise_id === id),
    injects: data.injects.filter((item) => item.exercise_id === id),
    feedbackEntries: data.feedbackEntries.filter((item) => item.exercise_id === id),
    syncMatrixEntries: data.syncMatrixEntries.filter((item) => item.exercise_id === id),
    evaluatorAssignments: data.evaluatorAssignments.filter((item) => item.exercise_id === id),
    decisionPoints: data.decisionPoints.filter((item) => item.exercise_id === id),
    capabilityGaps: data.capabilityGaps.filter((item) => item.exercise_id === id),
    trendInsights: data.trendInsights.filter((item) => item.exercise_id === id),
    evidenceItems: data.evidenceItems.filter((item) => item.exercise_id === id),
    poamItems: data.poamItems.filter((item) => item.exercise_id === id),
    error: data.error
  };
});
