"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/constants";
import { useApi } from "@/hooks/useApi";
import {
  HardHat,
  Camera,
  Truck,
  Tractor,
  Laptop,
  Speaker,
  ArrowRight,
  Layers,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  HardHat,
  Camera,
  Truck,
  Tractor,
  Laptop,
  Speaker,
};

export default function CategoriesSection() {
  const { data: stats } = useApi<Record<string, number>>(
    "/equipment/categories/stats",
    { requiresAuth: false, immediate: true }
  );

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Industrial Diversity</span>
          </div>
          <h2 className="section-title">Explore by Industry</h2>
          <p className="section-sub">
            From heavy commercial machinery to specialized cinema optics, find exactly
            the gear suited to your operational scope.
          </p>
        </div>

        {/* Categories Grid with Framer Motion Stagger */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || HardHat;
            const categoryUrl = `/equipment?category=${encodeURIComponent(cat.name)}`;
            const count = stats?.[cat.name];

            return (
              <motion.div
                key={cat.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Link
                  href={categoryUrl}
                  className="warm-card p-6 block h-full group hover:border-amber-500/40 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                      {count !== undefined ? `${count} Unit${count === 1 ? "" : "s"}` : cat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-1.5 flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-amber-600" />
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
