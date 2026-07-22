"use client";

import { ArrowUp } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitMessage } from "@/hooks/use-submit-message";

export function ChatInput() {
  const [input, setInput] = useState("");
  const { submit, isPending } = useSubmitMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = input.trim();
    if (!value || isPending) return;
    setInput("");
    submit(value);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto w-full max-w-2xl px-4 pb-5 pt-2 md:px-8"
    >
      <div className="relative flex items-end gap-2 rounded-2xl border border-border/80 bg-background/80 p-2 shadow-[0_1px_0_oklch(0_0_0/0.04)] backdrop-blur-sm transition-colors focus-within:border-foreground/25">
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
          placeholder="Peça uma UI… ex: comparativo de vendas"
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
        Generative UI · tools tipadas via streamUI · MCP mock
      </p>
    </form>
  );
}
