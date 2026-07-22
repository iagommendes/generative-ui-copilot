# Adicionar um componente generativo

Objetivo da Etapa 2: registrar um novo widget **sem tocar no shell do chat**.

## Passos

1. Crie o componente apresentacional em `src/components/generative/`.
2. Se precisar de dados, adicione o resource em `src/lib/mcp/resources.ts` + kind em `client.ts`.
3. Registre a tool em `src/lib/generative/registry.tsx` (schema, `matchIntent`, `load`, `render`).
4. Exporte o componente em `src/components/generative/index.ts` (opcional, para DX).

O `buildTools()` e o `SYSTEM_PROMPT` leem o registry automaticamente — `streamUI` e a simulação GitHub Pages passam a conhecer a tool.

## Exemplo mínimo

```tsx
// em registry.tsx, dentro de generativeRegistry:
showKpiStat: {
  id: "showKpiStat",
  description: "Mostra um KPI numérico.",
  inputSchema: z.object({ label: z.string(), value: z.number() }),
  loadingLabel: "Calculando KPI…",
  matchIntent: (prompt) =>
    /kpi|indicador/.test(prompt.toLowerCase())
      ? { label: "Receita", value: 120 }
      : null,
  load: async (input) => input,
  render: ({ data }) => {
    const kpi = data as { label: string; value: number };
    return <KpiStat label={kpi.label} value={kpi.value} />;
  },
},
```

## Checklist

- [ ] Componente só recebe props tipadas (sem fetch interno)
- [ ] `matchIntent` cobre 1–2 frases naturais em PT-BR
- [ ] Tool aparece no modo demo / `/simulate` / GitHub Pages
- [ ] Com API key, o modelo consegue escolher a tool via descrição
