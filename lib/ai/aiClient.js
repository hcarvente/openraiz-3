// SERVER-SIDE ONLY. The only file that talks to the AI provider (Google Gemini). It reads the secret API key, so it must
// never be imported by browser code. Every AI feature (Job-Fit, the interview coach, translation drafts) goes through it.
import { GoogleGenAI } from "@google/genai";

// The model comes from the environment (GEMINI_MODEL) so it can change without editing code. The default was chosen by measuring
// the same Job-Fit request on the models this API accepts (2026-10-29): gemini-3.1-flash-lite answered 6 of 6 in a median 2.9 s
// (worst 5.5 s); gemini-3.5-flash-lite had a median 19.5 s and timed out once.
const DEFAULT_MODEL = "gemini-3.1-flash-lite";

// An error of our own, so callers can tell what went wrong without seeing raw provider details. `code` is a short label.
export class AiError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AiError";
    this.code = code;
  }
}

// The real SDK client. Only checks that the key EXISTS; its value is never printed or logged.
function createRealClient() {
  if (!process.env.GEMINI_API_KEY) throw new AiError("CONFIG", "GEMINI_API_KEY is not set on the server.");
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Sends ONE request and returns the raw result: { text, model, usage }. `text` is the AI's JSON as a STRING (not yet parsed or
// checked: see the feature's validator). `client` is optional: tests pass a fake so no real call (and no cost) happens.
//   systemPrompt    our fixed rules; kept separate from the untrusted text
//   userMessage     the data (a listing, what a visitor typed, ...), always treated as data
//   schema          the JSON shape we want back
//   maxOutputTokens a hard cap on the length of the answer (we pay per output token)
//   timeoutMs       stop waiting if the provider hangs
export async function callAi({ systemPrompt, userMessage, schema, maxOutputTokens = 700, timeoutMs = 20_000 }, client = createRealClient()) {
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const interaction = await client.interactions.create(
    {
      model,
      system_instruction: systemPrompt,
      input: userMessage,
      generation_config: { max_output_tokens: maxOutputTokens },
      response_format: { type: "text", mime_type: "application/json", schema },
    },
    // maxRetries 0: the SDK must NOT retry silently. A retry costs money and hides problems; trying again is the visitor's choice.
    { maxRetries: 0, timeout: timeoutMs },
  );

  // An answer that was cut off or did not finish may be broken JSON, so it is unusable.
  if (interaction.status !== undefined && interaction.status !== "completed") {
    throw new AiError("INCOMPLETE", `AI response status: ${interaction.status}`);
  }
  const text = interaction.output_text;
  if (typeof text !== "string" || text.trim() === "") throw new AiError("EMPTY", "The AI returned no text.");

  const usage = interaction.usage ?? {};
  return {
    text,
    model,
    usage: {
      inputTokens: usage.total_input_tokens ?? null,
      outputTokens: usage.total_output_tokens ?? null,
      thoughtTokens: usage.total_thought_tokens ?? null,
    },
  };
}
