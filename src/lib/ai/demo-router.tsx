import { generateId } from "ai";

import { BarChart } from "@/components/generative/bar-chart";
import { WeatherCard } from "@/components/generative/weather-card";
import type { UIMessage } from "@/lib/ai/types";
import { fetchMcpResource } from "@/lib/mcp/client";

/**
 * Fallback local sem API key.
 * Replica a intenção das tools para demos/dev sem provedor LLM.
 */
export async function routeDemoMessage(content: string): Promise<UIMessage> {
  const normalized = content.toLowerCase();
  const id = generateId();

  if (
    /venda|vendas|comparativ|gr[aá]fico|m[eé]trica|dashboard|ranking/.test(
      normalized,
    )
  ) {
    const period = /trimestre|quart/.test(normalized)
      ? "trimestre"
      : /mensal|m[eê]s/.test(normalized)
        ? "mensal"
        : undefined;
    const data = await fetchMcpResource({ kind: "sales", period });

    return {
      id,
      role: "assistant",
      display: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Modo demo (sem API key) · tool simulada{" "}
            <code className="font-mono text-xs">showBarChart</code>
          </p>
          <BarChart
            title={data.title}
            labels={data.labels}
            values={data.values}
          />
        </div>
      ),
    };
  }

  if (/clima|tempo|temperatura|weather/.test(normalized)) {
    const cityMatch = content.match(
      /(?:em|de|para)\s+([A-Za-zÀ-ÿ\s]+?)(?:\?|$)/i,
    );
    const city = cityMatch?.[1]?.trim();
    const data = await fetchMcpResource({ kind: "weather", city });

    return {
      id,
      role: "assistant",
      display: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Modo demo (sem API key) · tool simulada{" "}
            <code className="font-mono text-xs">showWeather</code>
          </p>
          <WeatherCard
            city={data.city}
            temperatureC={data.temperatureC}
            condition={data.condition}
          />
        </div>
      ),
    };
  }

  return {
    id,
    role: "assistant",
    display: (
      <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
        <p>
          Estou em <strong>modo demo</strong> (nenhuma API key configurada).
        </p>
        <p className="text-muted-foreground">
          Experimente: “Mostre o comparativo de vendas” ou “Clima em Curitiba”.
          Com <code className="font-mono text-xs">OPENAI_API_KEY</code> ou{" "}
          <code className="font-mono text-xs">ANTHROPIC_API_KEY</code>, o{" "}
          <code className="font-mono text-xs">streamUI</code> decide a tool.
        </p>
      </div>
    ),
  };
}
