type BarChartProps = {
  title: string;
  labels: string[];
  values: number[];
};

/**
 * Componente generativo invocado pelo modelo via tool `showBarChart`.
 * Mantido propositalmente apresentacional: dados vêm do MCP / tool result.
 */
export function BarChart({ title, labels, values }: BarChartProps) {
  const max = Math.max(...values, 1);

  return (
    <figure className="w-full max-w-md space-y-3">
      <figcaption className="text-sm font-medium tracking-tight">
        {title}
      </figcaption>
      <ul className="space-y-2">
        {labels.map((label, index) => {
          const value = values[index] ?? 0;
          const width = `${Math.round((value / max) * 100)}%`;

          return (
            <li key={label} className="space-y-1">
              <div className="flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
                <span>{label}</span>
                <span className="font-mono tabular-nums text-foreground">
                  {value}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[oklch(0.55_0.12_210)] transition-[width] duration-500 ease-out"
                  style={{ width }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
