"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import DataTable, { Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Pagination from "@/components/dashboard/Pagination";
import InvoiceModal from "@/components/dashboard/InvoiceModal";
import Loader from "@/components/Loader";
import { formatDate, calculateRentalDays } from "@/lib/utils";
import type { Booking, Paged } from "@/types";
import {
  CalendarDays,
  ExternalLink,
  Compass,
  FileText,
  Ban,
  Receipt,
} from "lucide-react";

export default function MyRentalsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useApi<Paged<Booking>>(
    `/bookings/my?page=${page}&limit=8`
  );
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);

  const bookings = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handleCancelBooking = async (booking: Booking) => {
    const result = await Swal.fire({
      title: "Cancel Rental Reservation?",
      text: `Are you sure you want to cancel your rental of "${booking.equipmentName}"?`,
      icon: "warning",
      input: "text",
      inputPlaceholder: "Optional reason for cancellation...",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel Booking",
      cancelButtonText: "Keep Active",
      background: "var(--card)",
      color: "var(--foreground)",
    });

    if (!result.isConfirmed) return;

    try {
      await api(`/bookings/${booking._id}/cancel`, {
        method: "PATCH",
        body: JSON.stringify({ reason: result.value || "Customer cancellation" }),
      });
      toast.success("Rental booking cancelled.");
      reload();
    } catch (err: any) {
      console.error("Cancellation error:", err);
      toast.error(err.message || "Failed to cancel booking.");
    }
  };

  const columns: Column<Booking>[] = [
    {
      header: "Equipment",
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            {b.equipmentImage ? (
              <Image
                src={b.equipmentImage}
                alt={b.equipmentName}
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-bold">
                GEAR
              </div>
            )}
          </div>
          <div>
            <Link
              href={`/equipment/${b.equipmentId}`}
              className="font-bold text-foreground hover:text-amber-600 transition-colors line-clamp-1 inline-flex items-center gap-1 group"
            >
              <span>{b.equipmentName}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
            <p className="text-xs text-muted-foreground">Owner: {b.ownerName || b.ownerEmail}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Rental Window",
      render: (b) => {
        const start = formatDate(b.startDate);
        const end = formatDate(b.endDate);
        const days = calculateRentalDays(b.startDate, b.endDate);

        return (
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-foreground">
              {start} → {end}
            </p>
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block">
              {days} {days === 1 ? "day" : "days"} (Qty: {b.quantity})
            </span>
          </div>
        );
      },
    },
    {
      header: "Total Cost",
      render: (b) => (
        <span className="font-extrabold text-foreground text-sm font-mono">
          ${Number(b.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Payment",
      render: (b) => <StatusBadge status={b.paymentStatus} />,
    },
    {
      header: "Rental Status",
      render: (b) => <StatusBadge status={b.bookingStatus} />,
    },
    {
      header: "Booked On",
      render: (b) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(b.createdAt)}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (b) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedInvoice(b)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs"
            title="View official receipt"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-600" />
            <span>Receipt</span>
          </button>

          {b.bookingStatus === "confirmed" && (
            <button
              type="button"
              onClick={() => handleCancelBooking(b)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              title="Cancel upcoming rental"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          )}

          <Link
            href={`/equipment/${b.equipmentId}`}
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
            title="View public equipment listing"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="warm-card p-6 rounded-3xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Customer Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            My Equipment Rentals
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track active reservations, duration schedules, receipt invoices, and completed rental history.
          </p>
        </div>

        <Link
          href="/equipment"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Rent More Gear</span>
        </Link>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loader message="Loading your rental history..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to load rentals: {error}</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={bookings}
            emptyMessage="You have not rented any equipment yet."
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </>
      )}

      {/* Invoice / Receipt Modal */}
      <InvoiceModal
        booking={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
}
