"use client";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";

/**
 * Layout da interface de chat.
 *
 * Uma composição: header mínimo + thread + composer.
 * Sem dashboard, sem cards no hero — o produto é a conversa + UI gerada.
 */
export function ChatShell() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,oklch(0.93_0.03_210),transparent_55%),linear-gradient(180deg,oklch(0.99_0.005_210),oklch(0.97_0.01_200))]"
      />

      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 px-4 md:px-8">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold tracking-tight">GenUI</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Generative UI Copilot
          </span>
        </div>
        <a
          href="/simulate"
          className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          Simular
        </a>
      </header>

      <ChatMessages />
      <ChatInput />
    </div>
  );
}
