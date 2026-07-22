import { z } from "zod";

import { BarChart } from "@/components/generative/bar-chart";
import { DataTable } from "@/components/generative/data-table";
import { WeatherCard } from "@/components/generative/weather-card";
import type { GenerativeEntry } from "@/lib/generative/types";
import { fetchMcpResource } from "@/lib/mcp/client";
import type {
  SalesComparison,
  SalesTable,
  WeatherSnapshot,
} from "@/lib/mcp/resources";

function parsePeriod(prompt: string): string | undefined {
  if (/trimestre|quart/.test(prompt)) return "trimestre";
  if (/mensal|m[eê]s|month/.test(prompt)) return "mensal";
  return undefined;
}

function parseCity(prompt: string): string | undefined {
  const match = prompt.match(/(?:em|de|para)\s+([A-Za-zÀ-ÿ\s]+?)(?:\?|$)/i);
  return match?.[1]?.trim();
}

const dataTableSchema = z.object({
  period: z
    .string()
    .optional()
    .describe('Período opcional, ex: "trimestre", "mensal".'),
  title: z.string().optional().describe("Título opcional da tabela."),
});

const barChartSchema = z.object({
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
});

const weatherSchema = z.object({
  city: z
    .string()
    .optional()
    .describe('Cidade, ex: "São Paulo", "Curitiba". Default: São Paulo.'),
});

const showDataTable: GenerativeEntry<typeof dataTableSchema> = {
  id: "showDataTable",
  description:
    "Mostra uma tabela com dados de vendas ou métricas. Use para pedidos de tabela, planilha ou lista tabular.",
  inputSchema: dataTableSchema,
  loadingLabel: "Montando tabela via MCP…",
  matchIntent: (prompt) => {
    const normalized = prompt.toLowerCase();
    if (!/tabela|table|planilha|lista tabular/.test(normalized)) {
      return null;
    }
    return { period: parsePeriod(normalized) };
  },
  load: async (input) =>
    fetchMcpResource({ kind: "sales-table", period: input.period }),
  render: ({ data, input }) => {
    const table = data as SalesTable;
    return (
      <div className="space-y-3">
        <p className="text-sm text-foreground/90">
          Tabela a partir de{" "}
          <code className="font-mono text-xs">{table.source}</code>.
        </p>
        <DataTable
          title={input.title ?? table.title}
          columns={table.columns}
          rows={table.rows}
        />
      </div>
    );
  },
};

const showBarChart: GenerativeEntry<typeof barChartSchema> = {
  id: "showBarChart",
  description:
    "Mostra um gráfico de barras com comparativo de vendas ou métricas. Use para pedidos de vendas, comparativos, rankings ou dashboards simples.",
  inputSchema: barChartSchema,
  loadingLabel: "Buscando vendas via MCP…",
  matchIntent: (prompt) => {
    const normalized = prompt.toLowerCase();
    if (
      !/venda|vendas|comparativ|gr[aá]fico|m[eé]trica|dashboard|ranking/.test(
        normalized,
      )
    ) {
      return null;
    }
    return { period: parsePeriod(normalized) };
  },
  load: async (input) =>
    fetchMcpResource({ kind: "sales", period: input.period }),
  render: ({ data, input }) => {
    const sales = data as SalesComparison;
    return (
      <div className="space-y-3">
        <p className="text-sm text-foreground/90">
          Comparativo pronto a partir de{" "}
          <code className="font-mono text-xs">{sales.source}</code>.
        </p>
        <BarChart
          title={input.title ?? sales.title}
          labels={sales.labels}
          values={sales.values}
        />
      </div>
    );
  },
};

const showWeather: GenerativeEntry<typeof weatherSchema> = {
  id: "showWeather",
  description:
    "Mostra um card de clima para uma cidade. Use para pedidos de tempo, temperatura ou clima.",
  inputSchema: weatherSchema,
  loadingLabel: "Consultando clima via MCP…",
  matchIntent: (prompt) => {
    const normalized = prompt.toLowerCase();
    if (!/clima|tempo|temperatura|weather/.test(normalized)) {
      return null;
    }
    return { city: parseCity(prompt) };
  },
  load: async (input) =>
    fetchMcpResource({ kind: "weather", city: input.city }),
  render: ({ data }) => {
    const weather = data as WeatherSnapshot;
    return (
      <div className="space-y-3">
        <p className="text-sm text-foreground/90">
          Clima atual ({weather.source}):
        </p>
        <WeatherCard
          city={weather.city}
          temperatureC={weather.temperatureC}
          condition={weather.condition}
        />
      </div>
    );
  },
};

/**
 * Fonte única de verdade: tools do streamUI + simulação client-side
 * leem deste registry. Novo widget = nova entrada aqui.
 */
export const generativeRegistry = {
  showDataTable,
  showBarChart,
  showWeather,
};

export type RegisteredToolId = keyof typeof generativeRegistry;
