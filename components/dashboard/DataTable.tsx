import { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
}

export default function DataTable<T extends { _id?: string }>({
  columns,
  rows,
  emptyMessage = "No records found.",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="warm-card p-12 text-center rounded-2xl space-y-3">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
          <PackageOpen className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-foreground">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground">
          New data will automatically appear here once activity occurs.
        </p>
      </div>
    );
  }

  return (
    <div className="warm-card rounded-2xl overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3.5 px-4 font-bold ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {rows.map((row, rIdx) => (
              <tr
                key={row._id || rIdx}
                className="hover:bg-muted/30 transition-colors group"
              >
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={`py-3.5 px-4 text-foreground ${col.className || ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
