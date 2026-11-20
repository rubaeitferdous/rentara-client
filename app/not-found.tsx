import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-xl shadow-amber-950/5">
          <Compass className="w-12 h-12" />
        </div>
        <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-black shadow-md">
          404
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
        Equipment Route Not Found
      </h1>
      <p className="text-muted-foreground max-w-md text-base leading-relaxed mb-8">
        The equipment listing or page you are looking for might have been retired,
        moved, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-amber-700 transition-all shadow-md shadow-amber-900/15"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Explore Equipment
        </Link>
      </div>
    </div>
  );
}
