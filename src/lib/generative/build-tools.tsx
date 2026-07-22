import type { ReactNode } from "react";
import type { z } from "zod";

import { GenerativeLoading } from "@/components/generative/loading";
import { generativeRegistry } from "@/lib/generative/registry";
import type { GenerativeEntry } from "@/lib/generative/types";

type ToolContext = {
  toolName: string;
  toolCallId: string;
};

function toStreamTool<TSchema extends z.ZodTypeAny>(entry: GenerativeEntry<TSchema>) {
  return {
    description: entry.description,
    inputSchema: entry.inputSchema,
    generate: async function* (
      input: z.infer<TSchema>,
      context: ToolContext,
    ): AsyncGenerator<ReactNode, ReactNode, void> {
      void context;
      yield <GenerativeLoading label={entry.loadingLabel} />;
      const data = await entry.load(input);
      return entry.render({ data, input });
    },
  };
}

/**
 * Materializa o registry no formato esperado por `streamUI({ tools })`.
 * O shell do chat nunca importa componentes individuais — só este builder.
 */
export function buildTools() {
  return {
    showDataTable: toStreamTool(generativeRegistry.showDataTable),
    showBarChart: toStreamTool(generativeRegistry.showBarChart),
    showWeather: toStreamTool(generativeRegistry.showWeather),
  };
}

export const generativeTools = buildTools();
