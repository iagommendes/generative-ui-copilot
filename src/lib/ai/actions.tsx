"use server";

import {
  createAI,
  getMutableAIState,
  streamUI,
} from "@ai-sdk/rsc";
import { generateId } from "ai";

import { GenerativeLoading } from "@/components/generative/loading";
import { routeDemoMessage } from "@/lib/ai/demo-router";
import { resolveLanguageModel } from "@/lib/ai/model";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { generativeTools } from "@/lib/ai/tools";
import type { AIMessage, AIState, UIMessage, UIState } from "@/lib/ai/types";

function toModelMessages(history: AIState) {
  return history
    .filter(
      (message): message is AIMessage & { role: "user" | "assistant" | "system" } =>
        message.role === "user" ||
        message.role === "assistant" ||
        message.role === "system",
    )
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

/**
 * Server Action do chat.
 *
 * Fluxo:
 * 1. Atualiza AIState com a mensagem do usuário
 * 2. Se houver API key → streamUI + tools tipadas
 * 3. Senão → demo-router local (mesmos componentes)
 * 4. Finaliza AIState e devolve UIMessage com ReactNode streaming
 */
export async function submitUserMessage(
  content: string,
): Promise<UIMessage> {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Mensagem vazia.");
  }

  const aiState = getMutableAIState<typeof AI>();
  const userMessageId = generateId();
  const assistantMessageId = generateId();

  aiState.update((current) => [
    ...current,
    { id: userMessageId, role: "user", content: trimmed },
  ]);

  const { model, provider } = resolveLanguageModel();

  if (!model) {
    const demo = await routeDemoMessage(trimmed);
    aiState.done([
      ...aiState.get(),
      {
        id: demo.id,
        role: "assistant",
        content: `[demo:${provider}] resposta generativa local`,
      },
    ]);
    return demo;
  }

  try {
    const result = await streamUI({
      model,
      system: SYSTEM_PROMPT,
      messages: toModelMessages(aiState.get()),
      initial: <GenerativeLoading label="Gerando interface…" />,
      text: ({ content }) => (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {content}
        </p>
      ),
      tools: generativeTools,
      onFinish: ({ finishReason }) => {
        aiState.done([
          ...aiState.get(),
          {
            id: assistantMessageId,
            role: "assistant",
            content: `[${provider}] finish=${finishReason}`,
          },
        ]);
      },
    });

    return {
      id: assistantMessageId,
      role: "assistant",
      display: result.value,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao gerar UI.";

    aiState.done([
      ...aiState.get(),
      {
        id: assistantMessageId,
        role: "assistant",
        content: `error: ${message}`,
      },
    ]);

    return {
      id: assistantMessageId,
      role: "assistant",
      display: (
        <div className="space-y-2 text-sm">
          <p className="text-destructive">Não consegui gerar a UI.</p>
          <p className="text-muted-foreground">{message}</p>
          <p className="text-muted-foreground">
            Verifique a API key ou use o modo demo removendo as variáveis de
            ambiente.
          </p>
        </div>
      ),
    };
  }
}

const actions = {
  submitUserMessage,
};

export const AI = createAI<AIState, UIState, typeof actions>({
  actions,
  initialAIState: [],
  initialUIState: [],
});
