import OpenAI from "openai";
import { requireAiAccess } from "@/lib/ai/access";

export async function generateText({
  system,
  prompt,
  fallback
}: {
  system: string;
  prompt: string;
  fallback: string;
}) {
  // Requires OPENAI_API_KEY in .env.local for live AI generation.
  // Without it, AFTERBURN returns instructional scaffolds instead of fabricated exercise content.
  if (!process.env.OPENAI_API_KEY) {
    return fallback;
  }

  await requireAiAccess();
  if (system.length + prompt.length > 100000) throw new Error("Shorten the planning text before generating.");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 45000, maxRetries: 0 });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    store: false,
    max_tokens: 4000,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt }
    ],
    temperature: 0.35
  });

  return completion.choices[0]?.message.content ?? fallback;
}

export function asPrompt(input: unknown) {
  return JSON.stringify(input, null, 2);
}
