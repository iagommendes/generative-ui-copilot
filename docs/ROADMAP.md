# Roadmap — GenUI (Generative UI Copilot)

Ordem pensada por **valor demonstrável** e **risco técnico**, não por calendário.

## Concluído

- [x] Scaffold Next.js + TypeScript strict + Tailwind + Shadcn
- [x] Provider `createAI` + shell de chat tipado (`AIState` / `UIState`)
- [x] `streamUI` com tools `showBarChart` e `showWeather`
- [x] Componentes generativos apresentacionais + loading stream
- [x] Camada MCP mock tipada (`fetchMcpResource`)
- [x] Modo demo sem API key (router local com os mesmos componentes)
- [x] Registry genérico (`generativeRegistry` + `buildTools`)
- [x] Widget `DataTable` + docs de contribuição
- [x] Simulação estática para GitHub Pages (Vite + mocks)

---

## Etapa 1 — Fechar o loop Generative UI (MVP usável)

**Objetivo:** qualquer prompt de vendas/clima vira UI confiável com API key real.

| Entrega | Detalhe |
| --- | --- |
| Observabilidade mínima | Logar `finishReason`, tool escolhida e latência por turno |
| System prompt versionado | A/B simples de instruções (quando forçar tool vs texto) |
| Validação de props | Zod no retorno MCP → falha amigável se dataset inválido |
| Empty / error states | Componentes generativos com empty/error tipados |
| Smoke test | Script que chama `submitUserMessage` em modo demo |

**Critério de pronto:** 3 prompts canônicos (vendas, trimestre, clima) passam com OpenAI e no modo demo.

---

## Etapa 2 — Registry de componentes + contrato de tools ✅

**Objetivo:** adicionar um novo widget sem tocar no shell do chat.

| Entrega | Status |
| --- | --- |
| `generativeRegistry` + `buildTools` | ✅ `src/lib/generative/` |
| Widget `DataTable` | ✅ |
| Docs | ✅ `docs/ADDING_A_COMPONENT.md` |
| Demo GitHub Pages | ✅ `demo/` + workflow Actions |

**Próximos widgets sugeridos:** `KpiStat`, `LineChart`.

---

## Etapa 3 — MCP real (fonte de dados)

**Objetivo:** trocar mocks por servers MCP sem mudar a UI.

| Entrega | Detalhe |
| --- | --- |
| Cliente `@modelcontextprotocol/sdk` | Conexão stdio/HTTP a 1 server |
| Adapter | `fetchMcpResource` lê URI real (`sales://…`, `weather://…`) |
| Server de exemplo | Repo/local com resources de vendas + clima |
| Fallback | Se MCP cair, usa mock e sinaliza na UI |

**Critério de pronto:** com server MCP no ar, o gráfico de vendas muda ao alterar o resource — zero mudança em `BarChart`.

---

## Etapa 4 — Multiturn + estado persistente

**Objetivo:** conversas com follow-ups (“agora mensal”, “e Curitiba?”).

| Entrega | Detalhe |
| --- | --- |
| Histórico rico no `AIState` | Incluir tool calls/results serializáveis |
| Persistência | `onSetAIState` → DB/KV (Vercel KV / Postgres) |
| Sessões | Restaurar thread por `chatId` na URL |
| UX | Lista lateral mínima de conversas |

**Critério de pronto:** refresh da página mantém a última thread e follow-up usa contexto.

---

## Etapa 5 — Qualidade de produto

**Objetivo:** parecer um vertical tool, não um demo.

| Entrega | Detalhe |
| --- | --- |
| Auth | Clerk/Auth.js (opcional para MVP interno) |
| Rate limit | Por usuário/IP nas Server Actions |
| Telemetria | OpenTelemetry ou PostHog (events: tool_invoked, ui_rendered) |
| Acessibilidade | Foco, labels, anúncio de UI streaming (aria-live) |
| Temas | Tokens CSS do produto (já parcialmente definidos) |

---

## Etapa 6 — Caminho para produção estável

**Objetivo:** reduzir risco do `@ai-sdk/rsc` experimental.

| Entrega | Detalhe |
| --- | --- |
| Dual path | Feature flag: RSC `streamUI` **ou** AI SDK UI (`streamText` + `useChat` + tool → component map) |
| Testes de contrato | Schema Zod ↔ props do componente (unit) |
| E2E | Playwright: prompt → aparece gráfico |
| Package | Extrair `packages/genui-core` (registry + types) se houver 2º app consumidor |

---

## Fora de escopo (por enquanto)

- Editor visual drag-and-drop de componentes
- Marketplace público de widgets
- Multiagente / orquestração complexa
- Vue/Nuxt (React first; port só se houver demanda clara)

---

## Ordem sugerida de execução

```text
Etapa 1 (fechar loop)
    → Etapa 2 (registry)
        → Etapa 3 (MCP real)
            → Etapa 4 (persistência)
                → Etapa 5 (produto)
                    → Etapa 6 (produção / migração UI)
```

Cada etapa deve deixar o app **demoável** sozinho; não empilhar 3 etapas antes de validar a anterior com usuários.
