"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import Loader from "@/components/Loader";
import type { Booking } from "@/types";
import {
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Calendar,
  Layers,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    if (!sessionId) {
      setStatus("error");
      setErrorMessage("No payment session reference found in URL.");
      return;
    }

    // Call server to verify Stripe session and idempotently create booking & transaction
    api<{ booking: Booking; alreadyProcessed?: boolean }>("/payments/confirm", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => {
        setBooking(res.booking);
        setStatus("success");
      })
      .catch((err) => {
        console.error("Payment confirmation error:", err);
        setStatus("error");
        setErrorMessage(
          err.message || "Failed to confirm payment with the payment gateway."
        );
      });
  }, [sessionId]);

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader message="Confirming Stripe payment and securing booking..." />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto shadow-lg shadow-red-950/5">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Payment Verification Notice
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {errorMessage || "We were unable to complete automated payment verification."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/equipment"
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-amber-700 transition-colors"
          >
            Explore Equipment
          </Link>
          <Link
            href="/dashboard/customer"
            className="px-5 py-2.5 rounded-xl border border-border text-foreground font-semibold text-xs hover:bg-muted transition-colors"
          >
            Check Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20 space-y-8 warm-glow">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/10 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="badge-warm text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20">
          Payment &amp; Booking Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Equipment Reserved Successfully!
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Your payment has been processed through Stripe. The equipment owner has been
          notified and will prepare your gear for dispatch.
        </p>
      </div>

      {/* Booking Receipt Card */}
      {booking && (
        <div className="warm-card p-6 sm:p-8 rounded-3xl shadow-xl shadow-amber-950/5 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Transaction Reference
              </span>
            </div>
            <span className="text-xs font-mono text-muted-foreground truncate max-w-[200px]">
              {booking._id}
            </span>
          </div>

          {/* Equipment Overview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
            {booking.equipmentImage && (
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-card border border-border shrink-0">
                <img
                  src={booking.equipmentImage}
                  alt={booking.equipmentName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="truncate flex-1">
              <h3 className="text-base font-bold text-foreground truncate">
                {booking.equipmentName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                Owner: {booking.ownerName} ({booking.ownerEmail})
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              PAID
            </span>
          </div>

          {/* Booking Specs */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground uppercase font-bold text-[10px] block">
                Rental Window
              </span>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {booking.startDate} → {booking.endDate}
                </span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground uppercase font-bold text-[10px] block">
                Units Reserved
              </span>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {booking.quantity} Unit{booking.quantity > 1 ? "s" : ""}
                </span>
              </p>
            </div>

            <div className="space-y-1 col-span-2">
              <span className="text-muted-foreground uppercase font-bold text-[10px] block">
                Delivery Site
              </span>
              <p className="font-semibold text-foreground flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="truncate">{booking.deliveryAddress}</span>
              </p>
            </div>
          </div>

          {/* Total Paid */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Total Paid (USD)</span>
            <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
              ${booking.totalAmount?.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/dashboard/customer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-amber-700 transition-colors shadow-md shadow-amber-900/15"
        >
          <span>View in My Rentals</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/equipment"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          Browse More Gear
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader fullScreen message="Loading confirmation..." />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
