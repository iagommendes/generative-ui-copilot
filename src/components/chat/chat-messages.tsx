"use client";

import { useUIState } from "@ai-sdk/rsc";
import { useEffect, useRef } from "react";

import { Message } from "@/components/chat/message";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSubmitMessage } from "@/hooks/use-submit-message";
import type { AI } from "@/lib/ai/actions";

const SUGGESTIONS = [
  "Mostre o comparativo de vendas",
  "Tabela de vendas do trimestre",
  "Clima em Curitiba",
] as const;

export function ChatMessages() {
  const [messages] = useUIState<typeof AI>();
  const { submit, isPending } = useSubmitMessage();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col justify-end px-4 pb-6 md:px-8">
        <div className="mx-auto w-full max-w-2xl space-y-5">
          <div className="space-y-3">
            <p className="font-[family-name:var(--font-geist-sans)] text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              GenUI
            </p>
            <p className="max-w-md text-base text-muted-foreground">
              Peça um comparativo, um clima ou qualquer insight — o agente
              responde com componentes React tipados, não só texto.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
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
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6 md:px-8">
        {messages.map((message) => (
          <Message key={message.id} role={message.role}>
            {message.display}
          </Message>
        ))}
        {isPending && (
          <Message role="assistant">
            <span className="text-sm text-muted-foreground">Gerando UI…</span>
          </Message>
        )}
        <div ref={endRef} aria-hidden />
      </div>
    </ScrollArea>
  );
}
