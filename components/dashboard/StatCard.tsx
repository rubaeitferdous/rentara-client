import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
}

export default function StatCard({ label, value, hint, icon }: StatCardProps) {
  return (
    <div className="warm-card p-5 rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-2xl sm:text-3xl font-extrabold text-foreground">
          {value}
        </p>
        {hint && (
          <p className="text-[11px] text-muted-foreground mt-1 font-medium">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
