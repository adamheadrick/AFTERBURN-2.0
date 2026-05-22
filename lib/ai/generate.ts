import OpenAI from "openai";

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

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
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
