# Demo no GitHub Pages

O app completo (Next.js + `streamUI` + Server Actions) **não roda** em GitHub Pages.
Por isso publicamos uma **simulação estática** (Vite) que usa o **mesmo registry e os mesmos componentes** com dados mockados.

## URL

Após habilitar Pages no repositório:

`https://iagommendes.github.io/generative-ui-copilot/`

## Local

```bash
npm run demo:dev      # http://localhost:5173/generative-ui-copilot/
npm run demo:build    # gera demo/dist
npm run demo:preview  # preview do build
```

No app Next completo: `http://localhost:3000/simulate`

## Ativar no GitHub

1. **Settings → Pages → Source**: GitHub Actions
2. Merge na `main` (ou rode o workflow `Deploy GitHub Pages demo` manualmente)
3. Aguarde o deploy do workflow

## O que a simulação cobre

- Intent matching via `generativeRegistry.matchIntent`
- Render de `BarChart`, `DataTable`, `WeatherCard`
- Latência mock do MCP

## O que não cobre

- Chamada real a OpenAI/Anthropic
- `streamUI` / Server Actions
- Persistência de sessão
