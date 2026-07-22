import type { ReactNode } from "react";

/**
 * AIState: o que o modelo "vê" — histórico serializável para o LLM.
 * Mantemos separado do UIState para não vazar ReactNodes no contexto do modelo.
 */
export type ChatRole = "user" | "assistant" | "system" | "tool";

export type AIMessage = {
  id: string;
  role: ChatRole;
  content: string;
  /** Nome da tool/generative component quando role === "tool" */
  name?: string;
};

export type AIState = AIMessage[];

/**
 * UIState: representação visual tipada da conversa.
 * `display` pode ser texto ou um componente streaming (RSC).
 */
export type UIMessage = {
  id: string;
  role: Extract<ChatRole, "user" | "assistant">;
  display: ReactNode;
};

export type UIState = UIMessage[];

export type ServerActionResult<T> = Promise<T>;
