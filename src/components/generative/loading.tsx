export function GenerativeLoading({ label = "Montando UI…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span
        aria-hidden
        className="size-2 animate-pulse rounded-full bg-[oklch(0.55_0.12_210)]"
      />
      <span className="animate-in fade-in-0 duration-300">{label}</span>
    </div>
  );
}
