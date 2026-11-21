"use client";

import Image from "next/image";
import type { Booking } from "@/types";
import StatusBadge from "./StatusBadge";
import { formatDate, calculateRentalDays } from "@/lib/utils";
import { Compass, Printer, X, ShieldCheck, Calendar, MapPin, Mail, Phone } from "lucide-react";

interface InvoiceModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export default function InvoiceModal({ booking, onClose }: InvoiceModalProps) {
  if (!booking) return null;

  const start = formatDate(booking.startDate, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const end = formatDate(booking.endDate, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const bookedDate = formatDate(booking.createdAt, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const rentalDays = calculateRentalDays(booking.startDate, booking.endDate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Top Action Bar (hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40 print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span>Rental Confirmation Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-600" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-foreground print:p-8">
          {/* Brand & Invoice Reference Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-stone-900 flex items-center justify-center text-white shadow-md">
                  <Compass className="w-5 h-5 text-amber-200" />
                </div>
                <span className="text-xl font-extrabold tracking-tight">
                  Rentara<span className="text-amber-600">.</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Premium Verified Equipment Rental Marketplace
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                receipts@rentara.market • www.rentara.market
              </p>
            </div>

            <div className="sm:text-right space-y-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Official Receipt #
              </span>
              <p className="font-mono font-extrabold text-sm text-foreground">
                INV-{booking._id.slice(-8).toUpperCase()}
              </p>
              <p className="text-xs text-muted-foreground">Issued: {bookedDate}</p>
              <div className="pt-1">
                <StatusBadge status={booking.paymentStatus} />
              </div>
            </div>
          </div>

          {/* Parties: Renter & Owner Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/20 p-4 rounded-2xl border border-border/60 text-xs">
            {/* Customer Details */}
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px] block">
                Billed To (Customer)
              </span>
              <p className="font-bold text-sm text-foreground">{booking.customerName}</p>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-amber-600" />
                <span>{booking.customerEmail}</span>
              </p>
              {booking.contactNumber && (
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-amber-600" />
                  <span>{booking.contactNumber}</span>
                </p>
              )}
              {booking.deliveryAddress && (
                <p className="text-muted-foreground flex items-start gap-1.5 pt-0.5">
                  <MapPin className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                  <span>{booking.deliveryAddress}</span>
                </p>
              )}
            </div>

            {/* Owner Details */}
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-muted-foreground text-[10px] block">
                Equipment Provider (Owner)
              </span>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-foreground">{booking.ownerName || "Equipment Owner"}</p>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-amber-600" />
                <span>{booking.ownerEmail}</span>
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Verified Fleet Partner
                </span>
              </div>
            </div>
          </div>

          {/* Equipment & Rental Schedule Itemized Table */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Rental Schedule & Item Details
            </span>

            <div className="warm-card rounded-2xl overflow-hidden border border-border">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Equipment</th>
                    <th className="py-2.5 px-3">Rental Window</th>
                    <th className="py-2.5 px-3 text-center">Qty</th>
                    <th className="py-2.5 px-3 text-right">Total Cleared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        {booking.equipmentImage && (
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-border">
                            <Image
                              src={booking.equipmentImage}
                              alt={booking.equipmentName}
                              fill
                              className="object-cover"
                              sizes="32px"
                              unoptimized
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-foreground text-xs">{booking.equipmentName}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            ID: {booking.equipmentId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-foreground">
                        {start} → {end}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Duration: {rentalDays} {rentalDays === 1 ? "day" : "days"}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center font-bold font-mono">
                      {booking.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold font-mono text-sm text-foreground">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-[11px] text-muted-foreground space-y-1 max-w-sm">
              <p className="font-semibold text-foreground">Payment Verification</p>
              <p className="font-mono text-[10px] break-all">
                Session ID: {booking.sessionId}
              </p>
              <p>
                All funds are cleared through encrypted Stripe checkout in accordance with platform
                escrow safety guidelines.
              </p>
            </div>

            <div className="w-full sm:w-60 warm-card p-3.5 rounded-2xl border border-border space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-mono font-medium">${Number(booking.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Security Deposit</span>
                <span className="font-mono font-medium">$0.00</span>
              </div>
              <div className="border-t border-border pt-1.5 flex justify-between font-extrabold text-foreground text-sm">
                <span>Total Paid</span>
                <span className="font-mono text-amber-600">
                  ${Number(booking.totalAmount).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-border pt-4 text-center text-[10px] text-muted-foreground">
            Thank you for choosing Rentara. If you require emergency equipment assistance or return
            adjustments, contact support@rentara.market.
          </div>
        </div>
      </div>
    </div>
  );
}
