/**
 * Re-export tipado do provider AI.
 *
 * Por quê arquivo dedicado em components/chat?
 * - O layout importa o provider daqui (fronteira de UI), não de lib/ai diretamente
 * - Facilita trocar a implementação (RSC createAI → AI SDK UI) sem mexer no app shell
 */
export { AI } from "@/lib/ai/actions";
export type { AIState, UIMessage, UIState } from "@/lib/ai/types";
