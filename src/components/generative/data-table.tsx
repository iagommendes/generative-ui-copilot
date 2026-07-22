type DataTableProps = {
  title: string;
  columns: string[];
  rows: Array<Array<string | number>>;
};

/**
 * Tabela generativa — registrada como tool `showDataTable`.
 * Apresentacional: dados vêm do MCP / registry.load.
 */
export function DataTable({ title, columns, rows }: DataTableProps) {
  return (
    <figure className="w-full max-w-lg space-y-3">
      <figcaption className="text-sm font-medium tracking-tight">
        {title}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/80 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              {columns.map((column) => (
                <th key={column} className="px-2 py-2 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={`${row[0]}-${rowIndex}`}
                className="border-b border-border/50 last:border-0"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={`${rowIndex}-${cellIndex}`}
                    className={
                      cellIndex === 0
                        ? "px-2 py-2 text-foreground/90"
                        : "px-2 py-2 font-mono tabular-nums text-foreground"
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
