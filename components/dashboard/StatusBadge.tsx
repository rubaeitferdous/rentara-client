export default function StatusBadge({ status }: { status?: string }) {
  const s = (status || "pending").toLowerCase();

  const styles: Record<string, string> = {
    approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    confirmed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    pending: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20",
    rejected: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    failed: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  };

  const styleClass = styles[s] || "bg-muted text-muted-foreground border-border";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize tracking-wide ${styleClass}`}
    >
      {s}
    </span>
  );
}
