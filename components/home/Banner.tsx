"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2 } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 warm-glow">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-amber-600/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Next-Gen Equipment Rental Marketplace</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Rent Professional Machinery &amp; Gear,{" "}
              <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">
                Without the Capital Hassle.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Connect with verified equipment owners across the country. Book heavy
              construction excavators, cinema camera packages, commercial haulers, and
              stage sound with live availability and guaranteed insurance.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/equipment"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/15 hover:shadow-xl hover:scale-[1.02]"
              >
                <span>Browse Equipment Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-card/80 text-foreground font-semibold text-sm hover:bg-muted transition-colors"
              >
                <span>List Your Equipment</span>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-border/80 grid grid-cols-3 gap-3 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-lg sm:text-xl">
                  <span>99.8%</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Uptime &amp; Safety</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-lg sm:text-xl">
                  <span>Zero</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Hidden Markups</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-lg sm:text-xl">
                  <span>Stripe</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">Escrow Security</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Image Card */}
              <div className="warm-card overflow-hidden rounded-3xl p-2.5 shadow-2xl shadow-amber-950/10">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200&q=80"
                    alt="Industrial and production machinery ready for rent"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <span className="badge-warm text-[10px] bg-amber-500/20 text-amber-300 border-amber-400/30">
                      Featured Heavy Fleet
                    </span>
                    <p className="font-bold text-base sm:text-lg text-white">
                      CAT 320 Hydraulic Excavators &amp; Pro Cinema Gear
                    </p>
                    <p className="text-xs text-stone-300">
                      Inspected daily, nationwide dispatch within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Verified Badge Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-6 -left-6 sm:-left-8 warm-card p-4 rounded-2xl shadow-xl shadow-amber-950/15 flex items-center gap-3 backdrop-blur-md bg-card/95 border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Verified Ownership</p>
                  <p className="text-[11px] text-muted-foreground">Certified condition guarantee</p>
                </div>
              </motion.div>

              {/* Floating Instant Availability Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -top-4 -right-4 sm:-right-6 warm-card p-3.5 rounded-2xl shadow-xl shadow-amber-950/15 flex items-center gap-2.5 backdrop-blur-md bg-card/95 border border-border"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">Real-Time Stock</p>
                  <p className="text-[11px] text-muted-foreground">Zero double bookings</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
