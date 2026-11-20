"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import DataTable, { Column } from "@/components/dashboard/DataTable";
import Loader from "@/components/Loader";
import type { Equipment } from "@/types";
import { Heart, Trash2, ExternalLink, MapPin, Tag, Compass } from "lucide-react";

interface FavoriteItem extends Equipment {
  favoritedAt?: string;
}

export default function FavoritesPage() {
  const { data: initialData, loading, error } = useApi<FavoriteItem[]>("/favorites");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    if (initialData) {
      setFavorites(initialData);
    }
  }, [initialData]);

  const handleRemove = async (equipmentId: string, name: string) => {
    const result = await Swal.fire({
      title: "Remove from Saved?",
      text: `Are you sure you want to remove "${name}" from your saved favorites?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Keep",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (!result.isConfirmed) return;

    try {
      await api(`/favorites/${equipmentId}`, { method: "DELETE" });
      setFavorites((prev) => prev.filter((item) => item._id !== equipmentId));
      toast.success("Removed from favorites");
    } catch (err: any) {
      console.error("Remove favorite failed:", err);
      toast.error(err.message || "Could not remove favorite");
    }
  };

  const columns: Column<FavoriteItem>[] = [
    {
      header: "Equipment",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                GEAR
              </div>
            )}
          </div>
          <div>
            <Link
              href={`/equipment/${item._id}`}
              className="font-bold text-foreground hover:text-amber-600 transition-colors line-clamp-1 inline-flex items-center gap-1 group"
            >
              <span>{item.name}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-600" />
                {item.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {item.location}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Rental Rate",
      render: (item) => (
        <div>
          <span className="font-extrabold text-foreground text-sm font-mono">
            ${Number(item.price).toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground ml-1">/{item.rentalType.toLowerCase()}</span>
        </div>
      ),
    },
    {
      header: "Stock",
      render: (item) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
            item.availableQuantity > 0
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
          }`}
        >
          {item.availableQuantity > 0 ? `${item.availableQuantity} in stock` : "Unavailable"}
        </span>
      ),
    },
    {
      header: "Saved On",
      render: (item) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {item.favoritedAt
            ? new Date(item.favoritedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/equipment/${item._id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
          >
            <span>Rent Now</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            type="button"
            onClick={() => handleRemove(item._id, item.name)}
            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Remove from favorites"
            aria-label="Remove from favorites"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="warm-card p-6 rounded-3xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>Saved Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            My Saved Favorites
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Keep track of gear you want to rent later or compare specifications.
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Equipment</span>
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loader message="Loading your saved equipment..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to load favorites: {error}</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={favorites}
          emptyMessage="You haven't saved any equipment to favorites yet."
        />
      )}
    </div>
  );
}
