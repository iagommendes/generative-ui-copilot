/**
 * Camada MCP: I/O de fontes externas isolada do shell de chat.
 *
 * Hoje serve recursos mock tipados. No roadmap, troca o backend por
 * @modelcontextprotocol/sdk conectado a servers reais.
 */

import {
  getSalesComparison,
  getWeatherSnapshot,
  type SalesComparison,
  type WeatherSnapshot,
} from "@/lib/mcp/resources";

export type McpResourceRef =
  | { kind: "sales"; period?: string }
  | { kind: "weather"; city?: string };

export async function fetchMcpResource(
  ref: Extract<McpResourceRef, { kind: "sales" }>,
): Promise<SalesComparison>;
export async function fetchMcpResource(
  ref: Extract<McpResourceRef, { kind: "weather" }>,
): Promise<WeatherSnapshot>;
export async function fetchMcpResource(
  ref: McpResourceRef,
): Promise<SalesComparison | WeatherSnapshot> {
  // Simula latência de um server MCP remoto.
  await new Promise((resolve) => setTimeout(resolve, 280));

  if (ref.kind === "sales") {
    return getSalesComparison(ref.period);
  }

  return getWeatherSnapshot(ref.city);
}
