"use client";

import { useActions, useUIState } from "@ai-sdk/rsc";
import { generateId } from "ai";
import { useTransition } from "react";

import type { AI } from "@/lib/ai/actions";

export function useSubmitMessage() {
  const [isPending, startTransition] = useTransition();
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;

    const userMessageId = generateId();

    setMessages((current) => [
      ...current,
      {
        id: userMessageId,
        role: "user",
        display: <p>{trimmed}</p>,
      },
    ]);

    startTransition(async () => {
      try {
        const response = await submitUserMessage(trimmed);
        setMessages((current) => [...current, response]);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro inesperado.";
        setMessages((current) => [
          ...current,
          {
            id: generateId(),
            role: "assistant",
            display: (
              <p className="text-sm text-destructive">{message}</p>
            ),
          },
        ]);
      }
    });
  }

  return { submit, isPending };
}
