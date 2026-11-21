"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import type { Equipment } from "@/types";
import BookingModal from "@/components/BookingModal";
import Loader from "@/components/Loader";
import {
  MapPin,
  Heart,
  Calendar,
  Layers,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Sparkles,
  Info,
  Mail,
} from "lucide-react";

interface EquipmentDetailsProps {
  id: string;
  userRole: string;
}

export default function EquipmentDetails({ id, userRole }: EquipmentDetailsProps) {
  const { data: item, loading, error } = useApi<Equipment>(`/equipment/${id}`);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const canBook = userRole === "customer" || userRole === "admin";

  // Check initial favorite status
  useEffect(() => {
    if (!canBook || !id) return;

    api<{ favorited: boolean }>(`/favorites/check/${id}`)
      .then((res) => setIsFavorited(Boolean(res.favorited)))
      .catch((err) => console.warn("Favorite check error:", err.message));
  }, [id, canBook]);

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    if (!canBook) {
      toast.error("Only customer or administrator accounts can save items to favorites.");
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorited) {
        await api(`/favorites/${id}`, { method: "DELETE" });
        setIsFavorited(false);
        toast.success("Removed from your favorites.");
      } else {
        await api("/favorites", {
          method: "POST",
          body: JSON.stringify({ equipmentId: id }),
        });
        setIsFavorited(true);
        toast.success("Saved to your favorites!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update favorites.");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen message="Loading Equipment Specifications..." />;
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Equipment Not Available</h2>
        <p className="text-sm text-muted-foreground">{error || "This listing could not be found."}</p>
        <Link
          href="/equipment"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Equipment Catalog</span>
        </Link>
      </div>
    );
  }

  const isAvailable = item.availableQuantity > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-8">
      {/* Back Button Breadcrumb */}
      <div>
        <Link
          href="/equipment"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Equipment</span>
        </Link>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Visual Gallery & Media */}
        <div className="lg:col-span-6 space-y-4">
          <div className="warm-card overflow-hidden rounded-3xl p-3 shadow-xl shadow-amber-950/5">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src={item.image || "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200"}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md bg-stone-900/80 text-white shadow-sm border border-white/10">
                  {item.category}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="warm-card p-6 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Rental Basis
              </span>
              <span className="text-sm font-bold text-foreground mt-0.5 block">
                {item.rentalType}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Condition
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {item.condition || "Excellent"}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Brand
              </span>
              <span className="text-sm font-bold text-foreground mt-0.5 block">
                {item.brand || "Industrial"}
              </span>
            </div>
            <div className="p-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Model
              </span>
              <span className="text-sm font-bold text-foreground mt-0.5 block">
                {item.model || "Standard"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Listing Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  isAvailable
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                    : "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"
                }`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.availableQuantity} Unit(s) Ready for Dispatch</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Currently Fully Rented Out</span>
                  </>
                )}
              </span>

              {canBook && (
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  disabled={favLoading}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    isFavorited
                      ? "bg-red-500/10 text-red-600 border-red-500/30"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorited ? "fill-red-600 text-red-600" : ""}`}
                  />
                  <span>{isFavorited ? "Favorited" : "Save to Favorites"}</span>
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {item.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{item.location}</span>
            </div>
          </div>

          {/* Pricing Highlight Box */}
          <div className="warm-card p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                Standard Rental Rate
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-3xl font-black text-amber-700 dark:text-amber-300">
                  ${item.price}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  / {item.rentalType.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-muted-foreground space-y-0.5">
              <p className="font-semibold text-foreground">Stripe Escrow Protected</p>
              <p>Instant availability verification</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Equipment Description
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Owner Information Card */}
          <div className="warm-card p-4 rounded-2xl flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-500/30 bg-muted shrink-0 flex items-center justify-center font-bold text-amber-700">
              {item.ownerImage ? (
                <img
                  src={item.ownerImage}
                  alt={item.ownerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-amber-600" />
              )}
            </div>
            <div className="truncate flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-foreground truncate">
                  {item.ownerName || "Equipment Owner"}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground truncate">{item.ownerEmail}</p>
            </div>
            <span className="badge-warm text-[10px] py-0.5 px-2">Verified Owner</span>
          </div>

          {/* Rental Terms and Conditions */}
          {item.terms && (
            <div className="warm-card p-4 rounded-2xl bg-muted/30 border border-border space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Rental Terms &amp; Conditions</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
                {item.terms}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2">
            {canBook ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => setBookingModalOpen(true)}
                  className="flex-1 w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/15 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isAvailable ? "Book Equipment Now" : "Currently Unavailable"}</span>
                </button>

                <a
                  href={`mailto:${item.ownerEmail}?subject=${encodeURIComponent(
                    `Inquiry regarding ${item.name} on Rentara`
                  )}`}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>Contact Owner</span>
                </a>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-semibold text-center">
                You are currently viewing as an {userRole.toUpperCase()}. Equipment booking and
                favorites are available to Customer and Administrator accounts.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          equipment={item}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
