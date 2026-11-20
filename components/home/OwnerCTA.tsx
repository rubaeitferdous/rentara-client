import Link from "next/link";
import { ArrowRight, DollarSign, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

export default function OwnerCTA() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-amber-700 via-stone-900 to-stone-950 text-white p-8 sm:p-12 lg:p-16 border border-amber-500/20 shadow-2xl shadow-amber-950/20">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>For Equipment Owners &amp; Fleet Managers</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Turn Idle Machinery Into High-Yield Monthly Revenue.
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
              Don&apos;t let heavy construction machinery, camera packages, or transport
              vehicles depreciate in storage. List your gear on Rentara, set your own
              rental terms, and let our verified network generate consistent cashflow.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verified Renters Only</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <DollarSign className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fast Direct Payouts</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-200">
                <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Full Analytics Dashboard</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-950/20 hover:scale-[1.02]"
              >
                <span>List Equipment Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/equipment"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
