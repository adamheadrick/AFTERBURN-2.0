import { NextResponse } from "next/server";
import { z } from "zod";
import {
  dropoffCategories,
  dropoffFunctionalAreas,
  dropoffModules,
  dropoffUrgencyLevels,
  dropoffVisibilityRecommendations
} from "@/lib/dropoff-options";
import { screenDropoffSubmission, statusFromScreening } from "@/lib/dropoff-screening";
import { hasSupabaseConfig } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

const attachmentSchema = z.object({
  file_name: z.string().min(1),
  file_type: z.string().optional().default("unknown"),
  file_size: z.number().nonnegative().default(0)
});

const schema = z.object({
  title: z.string().min(3),
  category: z.enum(dropoffCategories),
  body: z.string().min(5),
  recommended_action: z.string().optional().default(""),
  exercise_id: z.string().optional().nullable(),
  exercise_event: z.string().optional().default(""),
  module_context: z.enum(dropoffModules).optional().default("Planning"),
  phase: z.enum(dropoffModules).optional().default("Planning"),
  entity: z.string().optional().default(""),
  functional_area: z.enum(dropoffFunctionalAreas).optional().default("Operations"),
  tags: z.array(z.string()).optional().default([]),
  urgency: z.enum(dropoffUrgencyLevels).optional().default("Medium"),
  visibility_recommendation: z.enum(dropoffVisibilityRecommendations).optional().default("Internal Review Only"),
  attachments: z.array(attachmentSchema).optional().default([])
});

function cleanUuid(value?: string | null) {
  return value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Complete the required Dropoff fields before submitting." }, { status: 400 });
  }

  const submittedAt = new Date().toISOString();
  const submissionId = crypto.randomUUID();
  const screeningReportId = crypto.randomUUID();
  const screeningReport = await screenDropoffSubmission(parsed.data);
  const status = statusFromScreening(screeningReport);

  const submission = {
    id: submissionId,
    title: parsed.data.title,
    category: parsed.data.category,
    body: parsed.data.body,
    recommended_action: parsed.data.recommended_action,
    exercise_id: cleanUuid(parsed.data.exercise_id),
    exercise_event: parsed.data.exercise_event,
    module_context: parsed.data.module_context,
    phase: parsed.data.phase,
    entity: parsed.data.entity,
    functional_area: parsed.data.functional_area,
    tags: parsed.data.tags,
    urgency: parsed.data.urgency,
    visibility_recommendation: parsed.data.visibility_recommendation,
    submitted_by: null as string | null,
    submitted_at: submittedAt,
    status,
    ai_screening_status: status,
    ai_risk_level: screeningReport.risk_level,
    ai_confidence: screeningReport.confidence_score,
    created_at: submittedAt,
    updated_at: submittedAt
  };

  const report = {
    id: screeningReportId,
    submission_id: submissionId,
    ...screeningReport,
    created_at: submittedAt
  };

  const attachments = parsed.data.attachments.map((attachment) => ({
    id: crypto.randomUUID(),
    submission_id: submissionId,
    file_name: attachment.file_name,
    file_type: attachment.file_type,
    file_url: "",
    file_size: attachment.file_size,
    uploaded_by: null as string | null,
    uploaded_at: submittedAt,
    screening_status: status,
    risk_level: screeningReport.risk_level
  }));

  let persistenceWarning = "";

  if (hasSupabaseConfig()) {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Sign in before submitting Dropoff items." }, { status: 401 });
    }

    submission.submitted_by = user.id;
    attachments.forEach((attachment) => {
      attachment.uploaded_by = user.id;
    });

    const { error: submissionError } = await supabase.from("dropoff_submissions").insert(submission);

    if (submissionError) {
      persistenceWarning = submissionError.message;
    } else {
      const { error: reportError } = await supabase.from("dropoff_screening_reports").insert(report);

      if (reportError) {
        persistenceWarning = reportError.message;
      }

      if (attachments.length > 0) {
        const { error: attachmentError } = await supabase.from("dropoff_attachments").insert(attachments);

        if (attachmentError) {
          persistenceWarning = attachmentError.message;
        }
      }
    }
  }

  return NextResponse.json({
    message: "Received for screening.",
    submission,
    screeningReport: report,
    attachments,
    persistenceWarning
  });
}
