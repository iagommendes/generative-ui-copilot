import { z } from "zod";

import { BarChart } from "@/components/generative/bar-chart";
import { GenerativeLoading } from "@/components/generative/loading";
import { WeatherCard } from "@/components/generative/weather-card";
import { fetchMcpResource } from "@/lib/mcp/client";

/**
 * Tools do streamUI: o modelo escolhe qual componente invocar.
 * Cada `generate` busca dados tipados (MCP) e devolve um ReactNode.
 */
export const generativeTools = {
  showBarChart: {
    description:
      "Mostra um gráfico de barras com comparativo de vendas ou métricas. Use para pedidos de vendas, comparativos, rankings ou dashboards simples.",
    inputSchema: z.object({
      period: z
        .string()
        .optional()
        .describe(
          'Período ou recorte, ex: "trimestre", "mensal", "regiões". Deixe vazio para o default.',
        ),
      title: z
        .string()
        .optional()
        .describe("Título opcional do gráfico (sobrescreve o do dataset)."),
    }),
    generate: async function* ({
      period,
      title,
    }: {
      period?: string;
      title?: string;
    }) {
      yield <GenerativeLoading label="Buscando vendas via MCP…" />;

      const data = await fetchMcpResource({ kind: "sales", period });

      return (
        <div className="space-y-3">
          <p className="text-sm text-foreground/90">
            Comparativo pronto a partir de{" "}
            <code className="font-mono text-xs">{data.source}</code>.
          </p>
          <BarChart
            title={title ?? data.title}
            labels={data.labels}
            values={data.values}
          />
        </div>
      );
    },
  },

  showWeather: {
    description:
      "Mostra um card de clima para uma cidade. Use para pedidos de tempo, temperatura ou clima.",
    inputSchema: z.object({
      city: z
        .string()
        .optional()
        .describe('Cidade, ex: "São Paulo", "Curitiba". Default: São Paulo.'),
    }),
    generate: async function* ({ city }: { city?: string }) {
      yield <GenerativeLoading label="Consultando clima via MCP…" />;

      const data = await fetchMcpResource({ kind: "weather", city });

      return (
        <div className="space-y-3">
          <p className="text-sm text-foreground/90">
            Clima atual ({data.source}):
          </p>
          <WeatherCard
            city={data.city}
            temperatureC={data.temperatureC}
            condition={data.condition}
          />
        </div>
      );
    },
  },
};
