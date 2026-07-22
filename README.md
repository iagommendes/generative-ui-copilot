# GenUI — Generative UI Copilot

Motor de **Generative UI** para agentes de IA: intercepta a intenção do modelo e renderiza componentes React tipados sob demanda (via `streamUI`), em vez de texto puro.

## Decisões arquiteturais

| Decisão | Por quê |
| --- | --- |
| **Next.js (App Router) + React**, não Nuxt/Vue | `streamUI` / `@ai-sdk/rsc` e Shadcn UI são maduros em React RSC; tipagem ponta a ponta com Server Actions. |
| **`createAI` + Server Actions** | Provider único para `AIState` (contexto do LLM) e `UIState` (ReactNodes). Cliente usa `useUIState` / `useActions` com inferência. |
| **Separação `AIState` ≠ `UIState`** | O modelo só vê mensagens serializáveis; a UI pode streamar componentes sem poluir o prompt. |
| **`components/generative/`** | Registry dos widgets invocáveis (`BarChart`, `WeatherCard`). Tools do `streamUI` só passam props tipadas. |
| **`lib/mcp/`** | Fonte de dados externa isolada do shell de chat — tools buscam dados aqui, UI só renderiza. |
| **TypeScript `strict`** | Contratos estáveis entre tools, props dos componentes e estado do chat. |

> Nota: o AI SDK marca `@ai-sdk/rsc` como experimental e sugere AI SDK UI para produção. Mantemos RSC neste MVP porque o requisito é `streamUI`; a pasta `components/chat` isola a fronteira para uma migração futura.

## Estrutura de pastas

```text
src/
├── app/                         # Rotas Next.js (RSC)
├── components/
│   ├── chat/                    # Shell, input, messages, provider
│   ├── generative/              # BarChart, WeatherCard, loading
│   └── ui/                      # Shadcn
├── hooks/
│   └── use-submit-message.tsx   # Envio tipado + optimistic UI
├── lib/
│   ├── ai/
│   │   ├── actions.tsx          # createAI + streamUI
│   │   ├── tools.tsx            # Tools generativas tipadas
│   │   ├── demo-router.tsx      # Fallback sem API key
│   │   ├── model.ts             # Resolve OpenAI / Anthropic
│   │   ├── prompts.ts
│   │   └── types.ts
│   └── mcp/                     # Resources mock + client tipado
docs/
└── ROADMAP.md                   # Próximas etapas
```

## Setup

```bash
# Dependências (já no package.json após o scaffold)
npm install

# Variáveis de ambiente
cp .env.example .env.local
# Edite OPENAI_API_KEY ou ANTHROPIC_API_KEY

# Dev
npm run dev
```

### Comandos usados para iniciar este repositório

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes

npm install ai @ai-sdk/rsc @ai-sdk/openai @ai-sdk/anthropic zod \
  class-variance-authority clsx tailwind-merge lucide-react \
  @modelcontextprotocol/sdk

npx shadcn@latest init -d -y
npx shadcn@latest add button input textarea scroll-area separator avatar card -y
```

## Estado do MVP

- [x] Scaffold Next.js + Tailwind + Shadcn
- [x] Provider `createAI` + layout do chat
- [x] `streamUI` + tools tipadas (`showBarChart`, `showWeather`)
- [x] Componentes generativos + MCP mock tipado
- [x] Modo demo sem API key
- [ ] Cliente MCP real (ver [docs/ROADMAP.md](docs/ROADMAP.md))
- [ ] Registry genérico de componentes / persistência de sessões

## Roadmap

Próximas etapas (registry, MCP real, persistência, produção): **[docs/ROADMAP.md](docs/ROADMAP.md)**

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |

## Experimentar

Sem API key (modo demo):

1. `npm run dev`
2. Clique em **Mostre o comparativo de vendas** ou digite **Clima em Curitiba**

Com modelo real: preencha `OPENAI_API_KEY` ou `ANTHROPIC_API_KEY` em `.env.local`.
