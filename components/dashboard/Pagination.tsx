import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (newPage: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
      <span className="text-xs text-muted-foreground font-medium">
        Page <span className="font-bold text-foreground">{page}</span> of{" "}
        <span className="font-bold text-foreground">{totalPages}</span>
      </span>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="p-1.5 rounded-lg border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const num = idx + 1;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                page === num
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {num}
            </button>
          );
        })}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onChange(page + 1)}
          className="p-1.5 rounded-lg border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted transition-colors cursor-pointer"
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
