import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import type { LanguageModelV4 } from "@ai-sdk/provider";

export type ModelProvider = "openai" | "anthropic";

/**
 * Resolve o modelo a partir do ambiente.
 * Preferência: OPENAI_API_KEY → Anthropic → null (modo demo local).
 */
export function resolveLanguageModel(): {
  model: LanguageModelV4 | null;
  provider: ModelProvider | "demo";
} {
  if (process.env.OPENAI_API_KEY) {
    const modelId = process.env.OPENAI_MODEL ?? "gpt-4o";
    return { model: openai(modelId), provider: "openai" };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    const modelId = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
    return { model: anthropic(modelId), provider: "anthropic" };
  }

  return { model: null, provider: "demo" };
}
