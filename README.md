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
├── app/                      # Rotas Next.js (RSC)
│   ├── layout.tsx            # Root layout + <AI> provider
│   ├── page.tsx              # Entrada do chat
│   └── globals.css
├── components/
│   ├── chat/                 # Shell, input, messages, provider
│   ├── generative/           # Componentes invocáveis pelo modelo
│   └── ui/                   # Primitivos Shadcn
├── lib/
│   ├── ai/
│   │   ├── actions.tsx       # createAI + submitUserMessage
│   │   └── types.ts          # AIState / UIState
│   ├── mcp/
│   │   └── client.ts         # Stub MCP
│   └── utils.ts
└── hooks/
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
- [x] Placeholders `BarChart` / `WeatherCard` + stub MCP
- [ ] Conectar `streamUI` + tools tipadas ao modelo
- [ ] Cliente MCP real para dados de vendas / clima

## Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
