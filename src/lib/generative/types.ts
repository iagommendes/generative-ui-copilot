import type { ReactNode } from "react";
import type { z } from "zod";

/**
 * Contrato de um componente generativo registrável.
 * Adicionar um widget = implementar este shape + incluir no registry.
 */
export type GenerativeEntry<TSchema extends z.ZodTypeAny = z.ZodTypeAny> = {
  /** Nome da tool exposta ao modelo (streamUI). */
  id: string;
  description: string;
  inputSchema: TSchema;
  loadingLabel: string;
  /**
   * Matcher do modo simulação / demo sem LLM.
   * Retorna o input tipado se o prompt combinar; senão null.
   */
  matchIntent: (prompt: string) => z.infer<TSchema> | null;
  /** Busca dados (MCP mock ou real). */
  load: (input: z.infer<TSchema>) => Promise<unknown>;
  /** Renderiza o componente a partir dos dados tipados. */
  render: (args: {
    data: unknown;
    input: z.infer<TSchema>;
  }) => ReactNode;
};

export type GenerativeRegistry = Record<string, GenerativeEntry>;
