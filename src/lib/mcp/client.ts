/**
 * Camada MCP: I/O de fontes externas isolada do shell de chat.
 *
 * Hoje serve recursos mock tipados. No roadmap, troca o backend por
 * @modelcontextprotocol/sdk conectado a servers reais.
 */

import {
  getSalesComparison,
  getSalesTable,
  getWeatherSnapshot,
  type SalesComparison,
  type SalesTable,
  type WeatherSnapshot,
} from "@/lib/mcp/resources";

export type McpResourceRef =
  | { kind: "sales"; period?: string }
  | { kind: "sales-table"; period?: string }
  | { kind: "weather"; city?: string };

export async function fetchMcpResource(
  ref: Extract<McpResourceRef, { kind: "sales" }>,
): Promise<SalesComparison>;
export async function fetchMcpResource(
  ref: Extract<McpResourceRef, { kind: "sales-table" }>,
): Promise<SalesTable>;
export async function fetchMcpResource(
  ref: Extract<McpResourceRef, { kind: "weather" }>,
): Promise<WeatherSnapshot>;
export async function fetchMcpResource(
  ref: McpResourceRef,
): Promise<SalesComparison | SalesTable | WeatherSnapshot> {
  // Simula latência de um server MCP remoto.
  await new Promise((resolve) => setTimeout(resolve, 280));

  if (ref.kind === "sales") {
    return getSalesComparison(ref.period);
  }

  if (ref.kind === "sales-table") {
    return getSalesTable(ref.period);
  }

  return getWeatherSnapshot(ref.city);
}
