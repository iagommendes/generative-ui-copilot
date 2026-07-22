/**
 * Stub do cliente MCP.
 *
 * Por quê pasta dedicada?
 * - Isola I/O de fontes externas (CRM, analytics, weather APIs) do shell de chat
 * - Tools do streamUI vão chamar daqui, mantendo os componentes generativos burros
 *   (só recebem props tipadas e renderizam)
 *
 * Próximo passo: conectar @modelcontextprotocol/sdk a um ou mais servers.
 */

export type McpResourceRef = {
  serverId: string;
  uri: string;
};

export async function fetchMcpResource(
  ref: McpResourceRef,
): Promise<unknown> {
  void ref;
  throw new Error(
    "MCP client ainda não configurado. Implemente em src/lib/mcp/client.ts",
  );
}
