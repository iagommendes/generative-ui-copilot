import type { UIMessage } from "@/lib/ai/types";
import { resolveSimulation } from "@/lib/generative/resolve-simulation";

function createId() {
  return crypto.randomUUID();
}

/**
 * Fallback local sem API key — delega ao registry (mesmos componentes do streamUI).
 */
export async function routeDemoMessage(content: string): Promise<UIMessage> {
  const matched = await resolveSimulation(content);

  if (matched) {
    return {
      id: createId(),
      role: "assistant",
      display: (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Modo demo (sem API key) · tool{" "}
            <code className="font-mono text-xs">{matched.toolId}</code>
          </p>
          {matched.display}
        </div>
      ),
    };
  }

  return {
    id: createId(),
    role: "assistant",
    display: (
      <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
        <p>
          Estou em <strong>modo demo</strong> (nenhuma API key configurada).
        </p>
        <p className="text-muted-foreground">
          Experimente: “Mostre o comparativo de vendas”, “Tabela de vendas do
          trimestre” ou “Clima em Curitiba”. Com API key, o{" "}
          <code className="font-mono text-xs">streamUI</code> escolhe a tool no
          registry.
        </p>
      </div>
    ),
  };
}
