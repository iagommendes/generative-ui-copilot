import type { ReactNode } from "react";

import { generativeRegistry } from "@/lib/generative/registry";

export type SimulationResult = {
  toolId: string;
  display: ReactNode;
};

/**
 * Resolve um prompt contra o registry sem LLM.
 * Usado pelo modo demo (Server Action) e pela simulação GitHub Pages (client).
 */
export async function resolveSimulation(
  prompt: string,
): Promise<SimulationResult | null> {
  for (const [toolId, entry] of Object.entries(generativeRegistry)) {
    const input = entry.matchIntent(prompt);
    if (!input) continue;

    const data = await entry.load(input);
    return {
      toolId,
      display: entry.render({ data, input }),
    };
  }

  return null;
}

export const SIMULATION_SUGGESTIONS = [
  "Mostre o comparativo de vendas",
  "Tabela de vendas do trimestre",
  "Clima em Curitiba",
] as const;
