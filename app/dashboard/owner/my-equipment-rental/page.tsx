"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import DataTable, { Column } from "@/components/dashboard/DataTable";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Pagination from "@/components/dashboard/Pagination";
import Loader from "@/components/Loader";
import type { Booking, Paged } from "@/types";
import { Layers, MapPin, Phone, Mail, ExternalLink } from "lucide-react";

export default function OwnerRentalsPage() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useApi<Paged<Booking>>(`/bookings/owner?page=${page}&limit=10`);

  const bookings = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const columns: Column<Booking>[] = [
    {
      header: "Equipment",
      render: (b) => (
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            {b.equipmentImage ? (
              <Image
                src={b.equipmentImage}
                alt={b.equipmentName}
                fill
                className="object-cover"
                sizes="44px"
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
            <p className="text-xs text-muted-foreground">Order ID: {b._id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Renter Customer",
      render: (b) => (
        <div className="space-y-0.5">
          <p className="text-xs font-bold text-foreground">{b.customerName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Mail className="w-3 h-3 text-amber-600" />
            <span>{b.customerEmail}</span>
          </p>
          {b.contactNumber && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-600" />
              <span>{b.contactNumber}</span>
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Rental Duration",
      render: (b) => {
        const start = new Date(b.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const end = new Date(b.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return (
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-foreground">
              {start} → {end}
            </p>
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block">
              Quantity: {b.quantity} unit{b.quantity > 1 ? "s" : ""}
            </span>
          </div>
        );
      },
    },
    {
      header: "Total Revenue",
      render: (b) => (
        <span className="font-mono font-extrabold text-foreground text-sm">
          ${Number(b.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Payment",
      render: (b) => <StatusBadge status={b.paymentStatus} />,
    },
    {
      header: "Order Status",
      render: (b) => <StatusBadge status={b.bookingStatus} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="warm-card p-6 rounded-3xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Order Fulfillment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Equipment Rental Orders
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track customer bookings, scheduled delivery windows, and payment receipts.
          </p>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <Loader message="Loading rental orders..." />
      ) : error ? (
        <div className="warm-card p-8 text-center rounded-2xl text-rose-600 border border-rose-500/20">
          <p className="font-semibold text-sm">Failed to load orders: {error}</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={bookings}
            emptyMessage="No rental orders have been placed on your equipment yet."
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </>
      )}
    </div>
  );
}
