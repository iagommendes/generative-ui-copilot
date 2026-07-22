# GenUI — Generative UI Copilot

Motor de **Generative UI** para agentes de IA: intercepta a intenção do modelo e renderiza componentes React tipados sob demanda (via `streamUI`), em vez de texto puro.

**Demo estática (mock):** [iagommendes.github.io/generative-ui-copilot](https://iagommendes.github.io/generative-ui-copilot/) · detalhes em [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md)

## Decisões arquiteturais

| Decisão | Por quê |
| --- | --- |
| **Next.js (App Router) + React** | `streamUI` / `@ai-sdk/rsc` e Shadcn são maduros em React RSC. |
| **`createAI` + Server Actions** | Tipagem ponta a ponta; `AIState` / `UIState` sincronizados. |
| **`generativeRegistry` + `buildTools`** | Novo widget = entrada no registry, sem tocar no shell do chat. |
| **Demo Vite → GitHub Pages** | Pages não roda Server Actions; a simulação reutiliza o mesmo registry/mocks. |
| **`lib/mcp/`** | Dados isolados dos componentes (apresentacionais). |

## Estrutura

```text
src/
├── app/                    # Next.js (+ /simulate)
├── components/
│   ├── chat/               # ChatShell + SimulationShell
│   ├── generative/         # BarChart, DataTable, WeatherCard
│   └── ui/
├── lib/
│   ├── generative/         # registry, buildTools, resolveSimulation
│   ├── ai/                 # createAI + streamUI
│   └── mcp/
demo/                       # SPA Vite para GitHub Pages
docs/
├── ROADMAP.md
├── ADDING_A_COMPONENT.md
└── GITHUB_PAGES.md
```

## Setup

```bash
npm install --legacy-peer-deps
cp .env.example .env.local   # opcional: OPENAI_API_KEY / ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

Simulação local (mesmo motor da Pages):

```bash
npm run demo:dev             # http://localhost:5173/generative-ui-copilot/
# ou no Next: http://localhost:3000/simulate
```

## Estado do MVP

- [x] Scaffold Next.js + Tailwind + Shadcn
- [x] Provider `createAI` + chat tipado
- [x] `streamUI` + tools tipadas
- [x] Registry genérico + `DataTable`
- [x] MCP mock + modo demo sem API key
- [x] Simulação GitHub Pages
- [ ] Cliente MCP real
- [ ] Persistência multiturn

## Roadmap

[docs/ROADMAP.md](docs/ROADMAP.md) · contribuir com widget: [docs/ADDING_A_COMPONENT.md](docs/ADDING_A_COMPONENT.md)

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | App Next completo |
| `npm run build` | Build Next |
| `npm run lint` | ESLint |
| `npm run demo:dev` | Simulação Vite |
| `npm run demo:build` | Build estático → `demo/dist` |

## Experimentar

1. Sem API key: `npm run dev` → “Mostre o comparativo de vendas” / “Tabela de vendas do trimestre” / “Clima em Curitiba”
2. Com modelo: configure `.env.local` — o `streamUI` escolhe a tool no registry
3. Pelo browser sem clonar: abra a [demo no GitHub Pages](https://iagommendes.github.io/generative-ui-copilot/) (após o primeiro deploy)
