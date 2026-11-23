"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import type { Equipment } from "@/types";
import EquipmentCard from "@/components/EquipmentCard";
import { ArrowRight, Sparkles } from "lucide-react";

export default function FeaturedSection() {
  const { data: items, loading, error } = useApi<Equipment[]>(
    "/equipment/featured",
    { requiresAuth: false, immediate: true }
  );

  return (
    <section className="py-16 md:py-24 bg-card/50 border-y border-border/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Top Picks</span>
            </div>
            <h2 className="section-title text-left">Featured Equipment</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              High-demand certified gear curated for peak performance, backed by
              transparent daily, weekly, and monthly rates.
            </p>
          </div>

          <Link
            href="/equipment"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 transition-colors shrink-0 group"
          >
            <span>View Complete Inventory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="warm-card h-96 rounded-2xl bg-muted/40 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-red-500 font-semibold">{error}</p>
            <p className="text-xs text-muted-foreground">
              Ensure your backend server is running on port 5000.
            </p>
          </div>
        ) : !items || items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No featured equipment items found at this time.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {items.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="h-full"
              >
                <EquipmentCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
