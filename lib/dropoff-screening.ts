import { asPrompt, generateText } from "@/lib/ai/generate";
import type { DropoffRiskLevel, DropoffStatus } from "@/lib/dropoff-options";

export type DropoffAttachmentMetadata = {
  file_name: string;
  file_type: string;
  file_size: number;
};

export type DropoffScreeningInput = {
  title: string;
  category: string;
  body: string;
  recommended_action?: string;
  exercise_event?: string;
  module_context?: string;
  phase?: string;
  entity?: string;
  functional_area?: string;
  tags?: string[];
  urgency?: string;
  visibility_recommendation?: string;
  attachments?: DropoffAttachmentMetadata[];
};

export type DropoffScreeningReportResult = {
  risk_level: DropoffRiskLevel;
  sensitivity_categories: string[];
  flagged_terms: string[];
  flagged_sections: string[];
  recommended_handling: string;
  suggested_sanitized_text: string;
  suggested_repository_category: string;
  suggested_tags: string[];
  confidence_score: number;
  model_used: string;
  reviewer_notes: string;
  review_required_boolean: boolean;
};

const screeningSystemPrompt = `You are an AI-assisted sensitive information screening assistant for AFTERBURN, an exercise planning, after-action review, and lessons learned platform used by military, emergency management, law enforcement, homeland defense, and interagency response organizations.

Your task is to review submitted text and attachments metadata for possible classified, controlled, sensitive, operationally exploitable, personal, proprietary, law enforcement sensitive, or otherwise restricted information.

You are not a classification authority. Do not make a final classification determination. Instead, identify potential risk indicators, explain why they may be sensitive, recommend handling, and produce a sanitized version suitable for human review.

Flag indicators including but not limited to: classified markings, CUI, FOUO, OPSEC-sensitive details, exact vulnerabilities, critical infrastructure weaknesses, communications frequencies, credentials, PII, medical details, law enforcement-sensitive information, force protection details, sensitive TTPs, non-public operational plans, and proprietary vendor information.

Return structured JSON with:
risk_level,
sensitivity_categories,
flagged_terms,
flagged_sections,
recommended_handling,
suggested_sanitized_text,
suggested_repository_category,
suggested_tags,
confidence_score,
review_required_boolean.`;

const sensitivityRules = [
  {
    category: "Classified marking or restricted dissemination indicator",
    risk: "Critical" as DropoffRiskLevel,
    pattern: /\b(TOP SECRET|SECRET|CONFIDENTIAL|NOFORN|SCI|REL TO|CLASSIFIED)\b/gi
  },
  {
    category: "CUI / FOUO / controlled information indicator",
    risk: "High" as DropoffRiskLevel,
    pattern: /\b(CUI|CONTROLLED UNCLASSIFIED INFORMATION|FOUO|FOR OFFICIAL USE ONLY|LES|LAW ENFORCEMENT SENSITIVE)\b/gi
  },
  {
    category: "Credentials, tokens, keys, or access instructions",
    risk: "Critical" as DropoffRiskLevel,
    pattern: /\b(password|passcode|api[_ -]?key|token|secret|credential|access code|login)\b\s*[:=]/gi
  },
  {
    category: "Potential PII",
    risk: "High" as DropoffRiskLevel,
    pattern: /\b(\d{3}-\d{2}-\d{4}|dob|date of birth|social security|ssn|personal phone|home address)\b/gi
  },
  {
    category: "Medical or protected health information",
    risk: "High" as DropoffRiskLevel,
    pattern: /\b(HIPAA|patient name|diagnosis|medical record|triage tag|protected health)\b/gi
  },
  {
    category: "Sensitive communications details",
    risk: "High" as DropoffRiskLevel,
    pattern: /\b(\d{2,4}\.\d{2,5}\s?(MHz|kHz)?|encryption key|radio fill|talkgroup password)\b/gi
  },
  {
    category: "Critical infrastructure vulnerability or exact weak point",
    risk: "High" as DropoffRiskLevel,
    pattern: /\b(vulnerability|unprotected access|single point of failure|disabled camera|unlocked gate|critical infrastructure weakness)\b/gi
  },
  {
    category: "OPSEC-sensitive operational detail",
    risk: "Medium" as DropoffRiskLevel,
    pattern: /\b(force protection|tactics|techniques|procedures|TTP|staging location|response route|security posture)\b/gi
  },
  {
    category: "Vendor proprietary or procurement-sensitive information",
    risk: "Medium" as DropoffRiskLevel,
    pattern: /\b(proprietary|source code|trade secret|vendor confidential|bid sensitive)\b/gi
  }
];

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

function riskWeight(risk: DropoffRiskLevel) {
  return { Low: 0, Medium: 1, High: 2, Critical: 3 }[risk];
}

function highestRisk(risks: DropoffRiskLevel[]): DropoffRiskLevel {
  return risks.sort((a, b) => riskWeight(b) - riskWeight(a))[0] ?? "Low";
}

function extractFlaggedSections(text: string, flaggedTerms: string[]) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  return unique(
    sentences.filter((sentence) =>
      flaggedTerms.some((term) => sentence.toLowerCase().includes(term.toLowerCase()))
    )
  ).slice(0, 6);
}

function sanitizeText(text: string, flaggedTerms: string[]) {
  return flaggedTerms.reduce((current, term) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return current.replace(new RegExp(escaped, "gi"), "[REVIEW REQUIRED]");
  }, text);
}

function fallbackScreenDropoffSubmission(input: DropoffScreeningInput): DropoffScreeningReportResult {
  const combinedText = [
    input.title,
    input.category,
    input.body,
    input.recommended_action,
    input.entity,
    input.functional_area,
    input.attachments?.map((file) => `${file.file_name} ${file.file_type}`).join(" ")
  ].filter(Boolean).join("\n");

  const detected = sensitivityRules.flatMap((rule) => {
    const matches = combinedText.match(rule.pattern) ?? [];
    return matches.map((term) => ({ category: rule.category, risk: rule.risk, term }));
  });

  const categories = unique(detected.map((item) => item.category));
  const flaggedTerms = unique(detected.map((item) => item.term)).slice(0, 12);
  const risk = highestRisk(detected.map((item) => item.risk));
  const reviewRequired = risk !== "Low";
  const suggestedTags = unique([
    input.category,
    input.functional_area,
    input.module_context,
    ...(input.tags ?? [])
  ].filter(Boolean) as string[]).slice(0, 8);

  return {
    risk_level: risk,
    sensitivity_categories: categories,
    flagged_terms: flaggedTerms,
    flagged_sections: extractFlaggedSections(combinedText, flaggedTerms),
    recommended_handling: reviewRequired
      ? "Route to an authorized reviewer before repository conversion. Review flagged content, sanitize operational details, and confirm distribution markings before reuse."
      : "No obvious sensitive indicators were detected by the local screening pass. Route to normal human review before repository conversion.",
    suggested_sanitized_text: flaggedTerms.length > 0
      ? sanitizeText(input.body, flaggedTerms)
      : input.body,
    suggested_repository_category: input.category === "Other" ? "Planning Consideration" : input.category,
    suggested_tags: suggestedTags,
    confidence_score: flaggedTerms.length > 0 ? 0.82 : 0.72,
    model_used: process.env.OPENAI_API_KEY ? (process.env.OPENAI_MODEL ?? "gpt-4.1-mini") : "deterministic-local-screening",
    reviewer_notes: "",
    review_required_boolean: reviewRequired
  };
}

function parseScreeningJson(text: string): Partial<DropoffScreeningReportResult> | null {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export function statusFromScreening(report: DropoffScreeningReportResult): DropoffStatus {
  if (report.risk_level === "Low" && !report.review_required_boolean) {
    return "Cleared for Review";
  }

  if (report.risk_level === "Medium") {
    return "Needs Human Review";
  }

  if (report.risk_level === "High") {
    return "Potential Sensitive Content";
  }

  return "Sanitization Required";
}

export async function screenDropoffSubmission(input: DropoffScreeningInput): Promise<DropoffScreeningReportResult> {
  const fallback = fallbackScreenDropoffSubmission(input);
  const fallbackJson = JSON.stringify(fallback, null, 2);

  let text = fallbackJson;

  try {
    text = await generateText({
      system: screeningSystemPrompt,
      prompt: `Screen this Dropoff submission. Treat the AI result as advisory only and do not approve publication.\n\n${asPrompt(input)}`,
      fallback: fallbackJson
    });
  } catch {
    text = fallbackJson;
  }

  const parsed = parseScreeningJson(text);

  if (!parsed) {
    return fallback;
  }

  const risk = ["Low", "Medium", "High", "Critical"].includes(String(parsed.risk_level))
    ? parsed.risk_level as DropoffRiskLevel
    : fallback.risk_level;

  return {
    risk_level: risk,
    sensitivity_categories: Array.isArray(parsed.sensitivity_categories) ? parsed.sensitivity_categories.map(String) : fallback.sensitivity_categories,
    flagged_terms: Array.isArray(parsed.flagged_terms) ? parsed.flagged_terms.map(String) : fallback.flagged_terms,
    flagged_sections: Array.isArray(parsed.flagged_sections) ? parsed.flagged_sections.map(String) : fallback.flagged_sections,
    recommended_handling: typeof parsed.recommended_handling === "string" ? parsed.recommended_handling : fallback.recommended_handling,
    suggested_sanitized_text: typeof parsed.suggested_sanitized_text === "string" ? parsed.suggested_sanitized_text : fallback.suggested_sanitized_text,
    suggested_repository_category: typeof parsed.suggested_repository_category === "string" ? parsed.suggested_repository_category : fallback.suggested_repository_category,
    suggested_tags: Array.isArray(parsed.suggested_tags) ? parsed.suggested_tags.map(String) : fallback.suggested_tags,
    confidence_score: typeof parsed.confidence_score === "number" ? parsed.confidence_score : fallback.confidence_score,
    model_used: process.env.OPENAI_API_KEY ? (process.env.OPENAI_MODEL ?? "gpt-4.1-mini") : fallback.model_used,
    reviewer_notes: "",
    review_required_boolean: typeof parsed.review_required_boolean === "boolean" ? parsed.review_required_boolean : fallback.review_required_boolean
  };
}
