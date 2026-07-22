"use server";

import { generateId } from "ai";
import {
  createAI,
  getMutableAIState,
  // streamUI — plugado na próxima iteração com tools + componentes generativos
} from "@ai-sdk/rsc";

import type { AIState, UIMessage, UIState } from "@/lib/ai/types";

/**
 * Server Action invocada pelo chat.
 *
 * Por quê Server Action + createAI (em vez de Route Handler puro)?
 * - Tipagem ponta a ponta entre cliente e servidor
 * - Compatível com streamUI / RSC do AI SDK
 * - UIState e AIState sincronizados pelo provider
 *
 * Nesta base, ainda não chamamos o modelo: retornamos um placeholder tipado
 * para validar o provider/layout. O próximo passo substitui o corpo por streamUI.
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

  // TODO(mvp): trocar por streamUI({ model, messages, tools: { showBarChart, ... }})
  const assistantDisplay = (
    <div className="space-y-1 text-sm leading-relaxed text-foreground/90">
      <p>
        Recebi: <span className="font-medium text-foreground">“{trimmed}”</span>
      </p>
      <p className="text-muted-foreground">
        O motor Generative UI ainda não está conectado ao modelo. Na próxima
        etapa, <code className="font-mono text-xs">streamUI</code> vai decidir
        entre componentes como{" "}
        <code className="font-mono text-xs">&lt;BarChart /&gt;</code> e{" "}
        <code className="font-mono text-xs">&lt;WeatherCard /&gt;</code>.
      </p>
    </div>
  );

  aiState.done([
    ...aiState.get(),
    {
      id: assistantMessageId,
      role: "assistant",
      content:
        "Placeholder: conecte streamUI + tools para renderizar UI dinâmica.",
    },
  ]);

  return {
    id: assistantMessageId,
    role: "assistant",
    display: assistantDisplay,
  };
}

/**
 * Provider RSC: ponto único de verdade para AIState, UIState e actions.
 * O layout da app envolve a árvore com <AI> para expor useUIState / useActions.
 *
 * Actions é inferido via `typeof actions` (3º genérico) — sem isso, useActions
 * cai em `{}` e perde tipagem das Server Actions.
 */
const actions = {
  submitUserMessage,
};

export const AI = createAI<AIState, UIState, typeof actions>({
  actions,
  initialAIState: [],
  initialUIState: [],
});
