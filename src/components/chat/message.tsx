import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MessageProps = {
  role: "user" | "assistant";
  children: ReactNode;
};

export function Message({ role, children }: MessageProps) {
  const isUser = role === "user";

  return (
    <article
      className={cn(
        "flex w-full animate-in fade-in-0 slide-in-from-bottom-1 duration-300",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] space-y-1 text-sm leading-relaxed md:max-w-[70%]",
          isUser
            ? "rounded-2xl bg-foreground px-4 py-2.5 text-background"
            : "text-foreground",
        )}
      >
        {!isUser && (
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            GenUI
          </p>
        )}
        {children}
      </div>
    </article>
  );
}
