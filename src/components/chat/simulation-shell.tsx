"use client";

import { ArrowUp } from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { Message } from "@/components/chat/message";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  resolveSimulation,
  SIMULATION_SUGGESTIONS,
} from "@/lib/generative/resolve-simulation";

type SimMessage = {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
};

type SimulationShellProps = {
  /** Ex.: "GitHub Pages" | "Local" */
  badge?: string;
};

/**
 * Chat 100% client-side: simula o motor Generative UI via registry + mocks.
 * Não usa Server Actions — adequado para GitHub Pages / static hosting.
 */
export function SimulationShell({
  badge = "Simulação",
}: SimulationShellProps) {
  const [messages, setMessages] = useState<SimMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isPending]);

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;

    const userId = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", display: <p>{trimmed}</p> },
    ]);

    startTransition(async () => {
      const matched = await resolveSimulation(trimmed);

      const display = matched ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Simulação · tool{" "}
            <code className="font-mono text-xs">{matched.toolId}</code>
          </p>
          {matched.display}
        </div>
      ) : (
        <div className="space-y-2 text-sm leading-relaxed">
          <p>
            Não encontrei uma tool no registry para esse pedido (simulação
            mockada).
          </p>
          <p className="text-muted-foreground">
            Experimente vendas, tabela ou clima — os mesmos componentes do app
            completo.
          </p>
        </div>
      );

      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", display },
      ]);
    });
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input;
    setInput("");
    submit(value);
  }

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
        <span className="rounded-md border border-border/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {badge}
        </span>
      </header>

      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col justify-end px-4 pb-6 md:px-8">
          <div className="mx-auto w-full max-w-2xl space-y-5">
            <div className="space-y-3">
              <p className="text-3xl font-semibold tracking-tight md:text-4xl">
                GenUI
              </p>
              <p className="max-w-md text-base text-muted-foreground">
                Simulação estática com dados mockados: o registry escolhe o
                componente tipado a partir da intenção do prompt — sem API key.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SIMULATION_SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => submit(suggestion)}
                  className="rounded-full"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6 md:px-8">
            {messages.map((message) => (
              <Message key={message.id} role={message.role}>
                {message.display}
              </Message>
            ))}
            {isPending && (
              <Message role="assistant">
                <span className="text-sm text-muted-foreground">
                  Resolvendo tool no registry…
                </span>
              </Message>
            )}
            <div ref={endRef} aria-hidden />
          </div>
        </ScrollArea>
      )}

      <form
        onSubmit={onSubmit}
        className="mx-auto w-full max-w-2xl px-4 pb-5 pt-2 md:px-8"
      >
        <div className="relative flex items-end gap-2 rounded-2xl border border-border/80 bg-background/80 p-2 backdrop-blur-sm transition-colors focus-within:border-foreground/25">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Peça uma UI… ex: tabela de vendas"
            rows={1}
            disabled={isPending}
            className="min-h-11 flex-1 resize-none border-0 bg-transparent px-3 py-2.5 shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isPending}
            aria-label="Enviar mensagem"
            className="mb-0.5 size-9 shrink-0 rounded-xl"
          >
            <ArrowUp data-icon="inline-end" />
          </Button>
        </div>
        <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground">
          Dados mock · registry shared com o app Next.js
        </p>
      </form>
    </div>
  );
}
