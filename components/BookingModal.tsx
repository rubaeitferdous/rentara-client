"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { calcAmount } from "@/lib/pricing";
import type { Equipment } from "@/types";
import {
  Calendar,
  Layers,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  X,
  Sparkles,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface BookingModalProps {
  equipment: Equipment;
  onClose: () => void;
}

export default function BookingModal({ equipment, onClose }: BookingModalProps) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [quantity, setQuantity] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Real-time calculated price
  const totalAmount = calcAmount(
    equipment.rentalType,
    equipment.price,
    startDate,
    endDate,
    quantity
  );

  // Duration in days
  const startD = new Date(startDate);
  const endD = new Date(endDate);
  const diffDays =
    !isNaN(startD.getTime()) && !isNaN(endD.getTime()) && endD >= startD
      ? Math.floor((endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;

  async function handleConfirmBooking(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");

    if (!startDate || !endDate || !contactNumber.trim() || !deliveryAddress.trim()) {
      setValidationError("Please fill in all required fields (dates, contact, and address).");
      return;
    }

    if (endDate < startDate) {
      setValidationError("Rental end date must be on or after the start date.");
      return;
    }

    if (quantity < 1 || quantity > equipment.availableQuantity) {
      setValidationError(`Quantity must be between 1 and ${equipment.availableQuantity}.`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await api<{ url: string; sessionId: string }>(
        "/payments/checkout",
        {
          method: "POST",
          body: JSON.stringify({
            equipmentId: equipment._id,
            startDate,
            endDate,
            quantity,
            contactNumber: contactNumber.trim(),
            deliveryAddress: deliveryAddress.trim(),
            notes: notes.trim(),
          }),
        },
        true
      );

      if (response.url) {
        toast.success("Redirecting to secure Stripe Checkout...");
        window.location.href = response.url;
      } else {
        throw new Error("Unable to create checkout session URL.");
      }
    } catch (err: any) {
      console.error("Booking checkout failed:", err);
      setValidationError(err.message || "Failed to initialize payment. Please try again.");
      toast.error(err.message || "Booking failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl warm-card bg-card border border-border p-6 sm:p-8 shadow-2xl rounded-3xl my-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4 mb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>Rental Reservation</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Book {equipment.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              Rate: <span className="font-bold text-foreground">${equipment.price}</span> /{" "}
              {equipment.rentalType.toLowerCase()} • {equipment.availableQuantity} available
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {validationError && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleConfirmBooking} className="space-y-4">
          {/* Dates Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Start Date *</span>
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value > endDate) setEndDate(e.target.value);
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>End Date *</span>
              </label>
              <input
                type="date"
                required
                min={startDate || todayStr}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {/* Quantity & Contact Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Units Required *</span>
              </label>
              <input
                type="number"
                required
                min={1}
                max={equipment.availableQuantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>Contact Phone *</span>
              </label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+880 1700-000000"
                className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>Site Delivery Address *</span>
            </label>
            <input
              type="text"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="e.g. Plot 42, Block D, Bashundhara R/A, Dhaka"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Additional Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Special Instructions / Logistics (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Gate pass instructions, site operator notes, delivery hours..."
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Calculated Total Bar */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between mt-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                Total Rental Horizon
              </span>
              <span className="text-xs text-muted-foreground">
                {diffDays} day{diffDays > 1 ? "s" : ""} • {quantity} unit{quantity > 1 ? "s" : ""}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || totalAmount <= 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-amber-700 transition-colors shadow-md shadow-amber-900/15 disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Checkout...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Confirm &amp; Pay with Stripe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
