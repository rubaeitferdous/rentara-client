"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { Equipment } from "@/types";
import { MapPin, ArrowRight, CheckCircle2, AlertCircle, Shield } from "lucide-react";

interface EquipmentCardProps {
  item: Equipment;
}

export default function EquipmentCard({ item }: EquipmentCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isAvailable = item.availableQuantity > 0;

  const handleViewDetails = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/equipment/${item._id}`);
    } else {
      router.push(`/equipment/${item._id}`);
    }
  };

  return (
    <div className="warm-card h-full flex flex-col justify-between overflow-hidden group">
      {/* Card Header & Media */}
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={item.image || "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800"}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md bg-stone-900/80 text-white shadow-sm border border-white/10">
              {item.category}
            </span>
          </div>

          {/* Availability Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md shadow-sm border ${
                isAvailable
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                  : "bg-red-950/80 text-red-300 border-red-500/30"
              }`}
            >
              {isAvailable ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{item.availableQuantity} In Stock</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  <span>Rented Out</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-2.5">
          {/* Brand & Model */}
          {(item.brand || item.model) && (
            <p className="text-[11px] font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400">
              {[item.brand, item.model].filter(Boolean).join(" • ")}
            </p>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
            {item.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>

          {/* Description snippet */}
          {item.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Pricing & Action */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
              Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-foreground">
                ${item.price}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                /{item.rentalType?.toLowerCase() || "day"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleViewDetails}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-amber-700 transition-colors cursor-pointer shadow-sm group-hover:shadow-md"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
